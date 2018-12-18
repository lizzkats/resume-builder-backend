const ejs = require("ejs");
const fs = require("fs");
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = 3000;

const password = process.env.PASSWORD;
const send = require("gmail-send")({
        user: "resumebuildernoreply@gmail.com",
        pass: password,
        to: "katsnelson.lizz@gmail.com",
        subject: "Here is your resume",
        text: "now go get a job",
        files: "./resume.pdf"
      });


app.post("/generatePDF", (req, res) => {
  const props = req.body;
  let email = ejs.renderFile("./resume.ejs", props, function(err, data) {
    console.log(err || data);
    fs.writeFile("index.html", data, err => {
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
      "file:///Users/Lizz/Documents/Dev/resume-builder-backend/index.html",
      { waitUntil: "networkidle2" }
    );
    await page.pdf({ path: "resume.pdf", format: "A4" });
    await browser.close();
    send({subject: 'Here is your resume!'}, function (err, r) {
      res.sendStatus(200);
    })
  }
});

app.listen(port, () => console.log(`NASA listening on port ${port}!`));
