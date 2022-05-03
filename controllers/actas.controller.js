const database = require("../models");
const Actas = database.Actas;
const Users = database.Users;
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
        var data = {};
        pdfExtract.extract(path.resolve('assets/docs/' + file.originalname), options).then(data => {
            const page = data.pages[0].content;
            console.log(page[5].str);
            const tipo = page[13].str;
            const tipo2 = page[10].str;
            let curp, estado, nombre, apellidos;
            if (tipo.includes("Acta")) {
                switch (tipo) {
                    case "Acta de Nacimiento":
                        curp = page[2].str;
                        estado = page[10].str;
                        nombre = page[21].str;
                        apellidos = page[23].str + " " + page[25].str;
                        data = { tipo, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    case "Acta de Defunción":
                        curp = page[4].str;
                        estado = page[8].str;
                        nombre = page[31].str;
                        apellidos = page[32].str + " " + page[34].str;
                        data = { tipo, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    case "Acta de Matrimonio":
                        curp = page[4].str;
                        estado = page[8].str;
                        nombre = page[31].str;
                        apellidos = page[32].str + " " + page[34].str;
                        data = { tipo, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    default:
                        res.status(500).json({ message: "Error" })
                        break
                }
            }
            else if (tipo2.includes("Acta")) {
                switch (tipo2) {
                    case "Acta de Divorcio":
                        curp = page[2].str;
                        estado = page[7].str;
                        nombre = page[24].str;
                        apellidos = page[26].str + " " + page[28].str;
                        data = { tipo: tipo2, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    case "Acta de Matrimonio":
                        curp = page[2].str;
                        estado = page[7].str;
                        nombre = page[22].str;
                        apellidos = page[24].str + " " + page[26].str;
                        data = { tipo: tipo2, curp, estado, nombre, apellidos }
                        res.send(data);
                        break;
                    default:
                        res.status(500).json({ message: "Error" })
                        break
                }
            }
            else if (page[59].str == "Constancia de Vigencia de Derechos") {
                curp = page[36].str;
                estado = page[28].str;
                nombre = page[35].str;
                data = { tipo: page[59].str, curp, estado, nombre }
                res.send(data);
            }
            else if (page[10].str == "Constancia de Semanas Cotizadas en el IMSS") {
                curp = page[16].str;
                estado = page[45].str;
                nombre = page[14].str;
                data = { tipo: page[10].str, curp, estado, nombre }
                res.send(data);
            }
            else if (page[60].str == "Asignación de Número de Seguridad Social") {
                curp = page[19].str;
                estado = page[18].str;
                nombre = page[13].str + " " + page[14].str + " " + page[15].str;
                data = { tipo: page[60].str, curp, estado, nombre }
                res.send(data);
            }
            else if(page[71].str == "CONSTANCIA DE NO INHABILITACIÓN"){
                estado = "CHIAPAS";
                nombre = page[88].str;
                curp = page[90].str;
                data = { tipo: page[71].str, curp, estado, nombre }
                res.json(data);
            }
            else if(page[5].str == "Registro Federal de Contribuyentes"){
                let Arreglo = [];
                for (let i = 0; i < page.length; i++) {
                    Arreglo.push(page[i].str)
                }
                let curpIndex = Arreglo.findIndex(function finder(data){ return data === 'CURP:' });
                const curp = Arreglo[curpIndex+2];
                let nombreIndex = Arreglo.findIndex(function finder(data){ return data === 'Nombre (s):' });
                let matIndex = Arreglo.findIndex(function finder(data){ return data === 'Primer Apellido:' });
                let patIndex = Arreglo.findIndex(function finder(data){ return data === 'Segundo Apellido:' });
                const nombre = `${Arreglo[nombreIndex+2]} ${Arreglo[matIndex+2]} ${Arreglo[patIndex+2]}`;
                let estadoIndex = Arreglo.findIndex(function finder(data){ return data === 'Nombre de la Entidad Federativa:' });
                const estado = Arreglo[estadoIndex+2];
                data = {tipo: page[5].str, curp, estado, nombre};
                res.json(data);
            }
            else {
                res.status(406).send({ message: 'Actas/NSS Only!' });
            }

        }).catch(err => {
            res.status(500).json(err);
        });
    }
}

exports.loadActa = async (req, res) => {
    if(!req.body.price){
        return res.status(500).send({message: 'No data recived!'})
    }
    else{
        const { enterprise, provider, document, states, curp, nombreacta, requested, price } = req.body;
        try {
            
            let newActa = await Actas.create({ enterprise, provider, document, states, curp, nombreacta, requested, idcreated: req.usuarioID, price },
                { field: ['enterprise', 'provider', 'document', 'states', 'curp', 'nombreacta', 'requested', 'idcreated', 'price'] });
            if (newActa) {
                res.status(201).json({message: 'Acta Added!'});
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
}



exports.getMyCorte = async (req, res) => {
    const { username } = req.params;
    if(username == 'Edwin Poot'){
        await Actas.findAll().then(data => {
            return res.status(200).send(data);
        }).catch(err => {
            return res.status(500).send(err);
        });
    }
    else{
        await Actas.findAll({where: { provider: username }}).then(data => {
            return res.status(200).send(data);
        }).catch(err => {
            return res.status(500).send(err);
        });
    }
    
}

exports.getMyDates = async (req, res) => {
        



}

exports.getMyDocumentsUploaded = async (req, res) => {
    const { id } = req.params;
    const actas = await Actas.findAll({where: {idcreated: id}});
    if(actas.length != 0){
        return res.status(200).json(actas);
    }
    else{
        return res.status(404).json({
            message: 'Actas no found!'
        })
    }

}
