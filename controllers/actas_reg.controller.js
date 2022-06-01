const db = require('../models');
const actas_reg = db.Actas_reg;

exports.upPDF = (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'Please upload a file' });
    }
    else {
        var data = {};
        pdfExtract.extract(path.resolve('assets/docs/' + file.originalname), options).then(data => {
            const page = data.pages[0].content;
            const tipo = page[13].str;
            const tipo2 = page[10].str;
            let paginaString = [];
            for (let i = 0; i < page.length; i++) {
                paginaString.push(page[i].str);
            }
            let curp, estado, nombre, apellidos;
            if (tipo.includes("Acta")) {
                switch (tipo) {
                    case "Acta de Nacimiento":
                        curp = page[2].str;
                        estado = page[10].str;
                        nombre = page[21].str;
                        apellidos = page[23].str + " " + page[25].str;
                        if (nombre == " ") {
                            let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Registrada" });
                            nombre = paginaString[personaregistrada + 1]
                        }
                        if (apellidos == "  ") {
                            let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Registrada" });
                            apellidos = paginaString[personaregistrada + 3] + " " + paginaString[personaregistrada + 5]
                        }
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
            else if (page[71].str == "CONSTANCIA DE NO INHABILITACIÓN") {
                estado = "CHIAPAS";
                nombre = page[88].str;
                curp = page[90].str;
                data = { tipo: page[71].str, curp, estado, nombre }
                res.json(data);
            }
            else if (page[5].str == "Registro Federal de Contribuyentes") {
                let Arreglo = [];
                for (let i = 0; i < page.length; i++) {
                    Arreglo.push(page[i].str)
                }
                let curpIndex = Arreglo.findIndex(function finder(data) { return data === 'CURP:' });
                const curp = Arreglo[curpIndex + 2];
                let nombreIndex = Arreglo.findIndex(function finder(data) { return data === 'Nombre (s):' });
                let matIndex = Arreglo.findIndex(function finder(data) { return data === 'Primer Apellido:' });
                let patIndex = Arreglo.findIndex(function finder(data) { return data === 'Segundo Apellido:' });
                const nombre = `${Arreglo[nombreIndex + 2]} ${Arreglo[matIndex + 2]} ${Arreglo[patIndex + 2]}`;
                let estadoIndex = Arreglo.findIndex(function finder(data) { return data === 'Nombre de la Entidad Federativa:' });
                const estado = Arreglo[estadoIndex + 2];
                data = { tipo: page[5].str, curp, estado, nombre };
                res.json(data);
            }
            else {

                if (paginaString.includes("Acta de Nacimiento")) {
                    let curpIndex = paginaString.findIndex(function finder(data) { return data === "Clave Única de Registro de Población" });
                    curp = paginaString[curpIndex + 2];
                    let stateIndex = paginaString.findIndex(function finder(data) { return data === "LUGAR DE REGISTRO" });
                    estado = paginaString[stateIndex + 2];
                    let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Registrada" });
                    nombre = paginaString[personaregistrada + 1]
                    apellidos = paginaString[personaregistrada + 3] + " " + paginaString[personaregistrada + 5]
                    data = { tipo, curp, estado, nombre, apellidos }
                    res.send(data);
                }
                else if(paginaString.includes("Acta de Defunción")){
                    let curpIndex = paginaString.findIndex(function finder(data) { return data === "Clave Única de Registro de Población" });
                    curp = paginaString[curpIndex + 2];
                    let stateIndex = paginaString.findIndex(function finder(data) { return data === "Entidad de Registro" });
                    estado = paginaString[stateIndex - 2];
                    let personaregistrada = paginaString.findIndex(function finder(data) { return data === "Datos de la Persona Fallecida:" });
                    nombre = paginaString[personaregistrada + 2]
                    apellidos = paginaString[personaregistrada + 4] + " " + paginaString[personaregistrada + 6]
                    data = { tipo: "Acta de Defunción", curp, estado, nombre, apellidos }
                    res.send(data);
                }
                else if(paginaString.includes("AVISO PARA RETENCIÓN DE DESCUENTOS") == true && paginaString.includes("POR ORIGINACIÓN DE CRÉDITO") == false){
                    curp = paginaString[paginaString.length - 7];
                    nombreFull = paginaString[paginaString.length - 6];
                    nombre = nombreFull.split(' ')[0] +" "+ nombreFull.split(' ')[1];
                    apellidos = nombreFull.split(' ')[2] +" "+ nombreFull.split(' ')[3];
                    estado = paginaString[paginaString.length - 14].split(',')[1].split(' ')[1];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }
                else if(paginaString.includes("DE SUSPENSIÓN DE DESCUENTOS")){
                    curp = paginaString[paginaString.length - 6];
                    nombre = paginaString[paginaString.length - 11];
                    nombreFull = paginaString[paginaString.length - 1];
                    apellidos = nombreFull.split(' ')[nombreFull.split(' ').length-2] +" "+ nombreFull.split(' ')[nombreFull.split(' ').length-1];
                    nombre = nombreFull.split(' ')[0];
                    estado = paginaString[paginaString.length - 8].split(',')[1].split(' ')[1];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }
                else if(paginaString.includes("AVISO PARA RETENCIÓN DE DESCUENTOS") == true && paginaString.includes("POR ORIGINACIÓN DE CRÉDITO") == true){
                    curp = paginaString[paginaString.length - 36];
                    nombreFull = paginaString[paginaString.length - 34];
                    nombre = nombreFull.split(' ')[nombreFull.split(' ').length-1]
                    apellidos = nombreFull.split(' ')[0] +" "+ nombreFull.split(' ')[1];
                    estado = paginaString[paginaString.length - 18].split(' ')[0];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }

                else {
                    res.send(paginaString);
                    //res.status(406).send({ message: 'Actas/NSS Only!' });
                }
            }

        }).catch(err => {
            res.status(500).json(err);
        });
    }
}


