const database = require("../models");
const Actas = database.Actas;
const path = require("path");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};


exports.upPDF = (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'Please upload a file' });
    }
    else {
        pdfExtract.extract(path.resolve('assets/docs/' + file.originalname), options).then(data => {
            const page = data.pages[0].content;
            const tipo = page[13].str;
            let curp, estado, nombre, apellidos;

            if (tipo.includes("Acta")) {

                switch (tipo) {
                    case "Acta de Nacimiento":
                        curp = page[2].str;
                        estado = page[10].str;
                        nombre = page[21].str;
                        apellidos = page[23].str + " " + page[25].str;
                        console.log(`tipo: ${tipo}`);
                        console.log(`curp: ${curp}`);
                        console.log(`estado: ${estado}`);
                        console.log(`nombre: ${nombre}`);
                        console.log(`apellidos: ${apellidos}`);
                        data = { tipo, curp, estado, nombre, apellidos}

                        res.send(data);
                        break;
                    case "Acta de Defunción":
                        curp = page[4].str;
                        estado = page[8].str;
                        nombre = page[31].str;
                        apellidos = page[32].str+" "+page[34].str;
                        console.log(`tipo: ${tipo}`);
                        console.log(`curp: ${curp}`);
                        console.log(`estado: ${estado}`);
                        console.log(`nombre: ${nombre}`);
                        console.log(`apellidos: ${apellidos}`);
                        data = { tipo, curp, estado, nombre, apellidos}
                        res.send(data);
                        break;
                    default:
                        res.status(500).json({message: "..."})
                        break
                }

                


            }
            else {
                res.status(404).json({ message: 'File doesnt exist' })
            }



        }).catch(err => {
            res.status(500).json({ err })
        });
    }
}