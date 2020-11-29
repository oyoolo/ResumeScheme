
// const PDFExtract = require('pdf.js-extract').PDFExtract;

import pkg from 'pdf.js-extract'
const {PDFExtract} = pkg
const pdfExtract = new PDFExtract();
const options = {}; /* see below */
pdfExtract.extract('sample.pdf', options, (err, data) => {
    if (err) return console.log(err);
    var text = ""
    data.pages.forEach(page => {

        page.content.forEach(content => {
            // console.log(content);
            text += `${content.str} \n`
        })

    });
    // let reg = /J/g
    // console.log(text.includes("Android Studio"));
    console.log(text);
});