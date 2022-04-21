const database = require("../models");
const Actas = database.Actas;
const path = require("path");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};


exports.upPDF = (req, res) => {
    const file = req.file;
    if(!file){
        res.status(500).json({message: 'Please upload a file'});
    }
    else{
        pdfExtract.extract(path.resolve('assets/docs/'+file.originalname), options).then(data =>{
            const page = data.pages[0].content;
            const tipe = page[13].str
            if(tipe.includes("Nacimiento")){
                res.send(`Es un ${tipe}`);
            }
            else{
                res.status(404).json({message: 'File doesnt exist'})
            }
            


        }).catch(err => {
            res.status(500).json({err})
        });
    }
}