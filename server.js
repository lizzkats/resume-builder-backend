require('dotenv').config()
const ejs = require("ejs");
const fs = require("fs");
const puppeteer = require("puppeteer");
const express = require("express");
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
var cors = require('cors');
const path = require('path');
const tmpPath = path.join('file://', __dirname, 'tmp/index.html')
console.log(tmpPath)

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

const ses = new AWS.SES();
const transporter = nodemailer.createTransport({
    SES: ses
});

function sendEmailNodemailer (event, context) {
  const mailOptions = {
    from: 'resumebuildernoreply@gmail.com',
    subject: "Your Resume is Here!",
    html: `<p>Good Luck!</p>`,
    to: process.env.EMAIL,
    attachments: [{filename:'resume.pdf', path: './resume.pdf'}]
  }

  transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
          console.log("Error sending email");
      } else {
          console.log("Email sent successfully");
      }
    })
  }


app.get('/', (req, res) => {res.send("Welcome to resume builder")});

app.post("/generatePDF", (req, res) => {
  const props = req.body;
  console.log(req.body)
  let email = ejs.renderFile("./resume.ejs", props, function(err, data) {
    console.log(err || data);
    fs.writeFile("tmp/index.html", data, err => {
      if (err) {
        throw err;
      }
      console.log("wrote file");
      makePDFandEmail();
    });
  });

  async function makePDFandEmail() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
     tmpPath,
      { waitUntil: "networkidle2" }
    );
    await page.pdf({ path: "resume.pdf", format: "A4" });
    await browser.close();
    sendEmailNodemailer()
    }
    res.send('Sending your email now')
  });

<<<<<<< HEAD
app.listen(process.env.PORT || port);
=======
app.listen(process.env.PORT, || port);
>>>>>>> 77ab088a7caf81addc3ea4079c2c9005868581ec
