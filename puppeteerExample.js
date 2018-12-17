const ejs = require('ejs');
const fs = require('fs');
const puppeteer = require('puppeteer');




let props = {name: 'John', title: 'Poopy Face'}

ejs.renderFile('./resume.ejs', props, function(err, data){
  console.log(err || data)
  fs.writeFile('index.html', data, (err) => {
    if(err){
      throw err;
    }
    console.log('wrote file');
    makePDF();
  })
});

async function makePDF() {
  console.log('in')
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file:///Users/Lizz/Documents/Dev/resume-builder-backend/index.html', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'resume.pdf', format: 'A4'});

  await browser.close();
}
