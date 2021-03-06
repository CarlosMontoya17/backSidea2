const db = require('../models');
const actas_reg = db.Actas_reg;
const actas_req = db.Actas_req;
const actas_trash = db.Actas_Trash;
const rfc_req = db.Rfc_req;
const Op = db.Sequelize.Op;
const Users = db.Users;
const path = require("path");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};

var Encrypt = {
    Document: (document) => {
        let documento;
        switch (document) {
            case "Asignación de Número de Seguridad Social":
                documento = "nss";
                break;
            case "Acta de Defunción":
                documento = "def";
                break;
            case "Acta de Nacimiento":
                documento = "nac";
                break;
            case "Acta de Matrimonio":
                documento = "mat";
                break;
            case "Acta de Divorcio":
                documento = "div";
                break;
            case "Constancia de Vigencia de Derechos":
                documento = "der";
                break;
            case "Constancia de Semanas Cotizadas en el IMSS":
                documento = "cot";
                break;
            case "Registro Federal de Contribuyentes":
                documento = "rfc";
                break;
            case "CONSTANCIA DE NO INHABILITACIÓN":
                documento = "inh";
                break;
            case "AVISO PARA RETENCIÓN DE DESCUENTOS":
                documento = "ret";
                break;
            default:
                documento = "";
                break;
        }
        return documento;
    },
    State: (states) => {
        let state;
        switch (states) {
            case "CHIAPAS":
                state = "chia";
                break;
            case "BAJA CALIFORNIA SUR":
                state = "bcs";
                break;
            case "BAJA CALIFORNIA":
                state = "bcn";
                break;
            case "YUCATAN":
                state = "yuca";
                break;
            case "VERACRUZ":
                state = "vera";
                break;
            case "VERACRUZ DE IGNACIO DE LA":
                state = "vera";
                break;
            case "VERACRUZ DE IGNACIO DE LA LLAVE":
                state = "vera";
                break;
            case "COAHUILA":
                state = "coah";
                break;
            case "COAHUILA DE ZARAGOZA":
                state = "coah";
                break;
            case "MICHOACAN":
                state = "mich";
                break;
            case "MICHOACAN DE OCAMPO":
                state = "mich";
                break;
            case "TLAXCALA":
                state = "tlax";
                break;
            case "DURANGO":
                state = "dura";
                break;
            case "AGUASCALIENTES":
                state = "agua";
                break;
            case "HIDALGO":
                state = "hida";
                break;
            case "PUEBLA":
                state = "pueb";
                break;
            case "QUERETARO":
                state = "quer";
                break;
            case "CHIHUAHUA":
                state = "chih";
                break;
            case "OAXACA":
                state = "oaxa";
                break;
            case "SONORA":
                state = "sono";
                break;
            case "SAN LUIS POTOSI":
                state = "slp";
                break;
            case "SINALOA":
                state = "sina";
                break;
            case "GUERRERO":
                state = "guer";
                break;
            case "ZACATECAS":
                state = "zaca";
                break;
            case "TAMAULIPAS":
                state = "tama";
                break;
            case "MORELOS":
                state = "more";
                break;
            case "TABASCO":
                state = "taba";
                break;
            case "GUANAJUATO":
                state = "guan";
                break;
            case "COLIMA":
                state = "coli";
                break;
            case "JALISCO":
                state = "jali";
                break;
            case "CDMX":
                state = "cdmx";
                break;
            case "CAMPECHE":
                state = "camp";
                break;
            case "NUEVO LEON":
                state = "nl";
                break;
            case "MEXICO":
                state = "mex";
                break;
            case "CIUDAD DE MEXICO":
                state = "mex";
                break;
            case "QUINTANA ROO":
                state = "qroo";
                break;
            case "NAYARIT":
                state = "naya";
                break;
            default:
                state = "";
                break;
        }
        if (states.includes("ESTADOS")) {
            state = "ext"
        }

        return state;
    }
}

var Assigments = {
    Levels: (startUser, users, documentEncrypt, stateEncrypt) => {
        var levels = {};
        var i = 0;
        while (true) {
            var lvlCurrent = {};
            if (i == 0) {
                lvlCurrent = users.find(element => {
                    return element["id"] == Number(startUser);
                });
            }
            else if (i < 5) {
                lvlCurrent = users.find(element => {
                    return element["id"] == Number(levels[i - 1].idSuper);
                });
            }
            else if (i == 5) {
                break;
            }
            try {

                if(lvlCurrent.precios[documentEncrypt][stateEncrypt] != undefined){
                    levels[i] = { "id": lvlCurrent.id, "price": Number(lvlCurrent.precios[documentEncrypt][stateEncrypt]), "idSuper" : lvlCurrent.idSuper };
                }
                else{
                    levels[i] = { "id": lvlCurrent.id, "price": Number(lvlCurrent.precios[documentEncrypt]), "idSuper": lvlCurrent.idSuper };
                }     
                // if(typeof (lvlCurrent.precios[documentEncrypt]) == "number") {
                //     levels[i] = { "id": lvlCurrent.id, "price": lvlCurrent.precios[documentEncrypt][stateEncrypt], "idSuper": lvlCurrent.idSuper };
                // }
                // else{
                //     levels[i] = { "id": lvlCurrent.id, "price": lvlCurrent.precios[documentEncrypt], "idSuper": lvlCurrent.idSuper };
                // }
            }
            catch {
                for (let index = i + 1; index < 6; index++) {
                    levels[index] = { "id": null, "price": null, "idSuper": null };
                }
                break;
            }
            if (levels[i].id == 1) {
                for (let index = i + 1; index < 6; index++) {
                    levels[index] = { "id": null, "price": null, "idSuper": null };
                }
                break;
            }
            i++;
        }
        return levels;
    },
    Pricing: (acta, idUser) => {
        var price = 0;
        if (idUser == acta.level0) {
            price = 0;
        }
        else if (idUser == acta.level1) {
            price = acta.price0;
        }
        else if (idUser == acta.level2) {
            price = acta.price1;
        }
        else if (idUser == acta.level3) {
            price = acta.price2;
        }
        else if (idUser == acta.level4) {
            price = acta.price3;
        }
        else if (idUser == acta.level5) {
            price = acta.price4;
        }
        return price;
    },
    Dating: (date) => {
        if (date == "null") {
            return JSON.parse(null);
        }
        else {
            return date;
        }
    },
    DeleteDuplicates: (data) => {
        return data.filter((c, index) => {
            return data.indexOf(c) === index;
        });
    },
    Costing: (acta, user) => {
        if (acta.level0 == user) {
            //Precio Vendido, Precio a Pagar, Pagar Al usuario
            return [0, acta.price0, acta.level1]
        }
        else if (acta.level1 == user) {
            return [acta.price0, acta.price1, acta.level2];
        }
        else if (acta.level2 == user) {
            return [acta.price1, acta.price2, acta.level3];
        }
        else if (acta.level3 == user) {
            return [acta.price2, acta.price3, acta.level4];
        }
        else if (acta.level4 == user) {
            return [acta.price3, acta.price4, acta.level5];
        }
        else if (acta.level5 == user) {
            return [acta.price0, 0, 0];
        }
    },
    SubstractHours: (numofHours, date = new Date()) => {
            date.setHours(date.getHours() - numofHours);
            return date;
    }
}

//Leer PDFs
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

                if(paginaString.includes("Denominación/Razón Social:")){
                    let curpIndex = Arreglo.findIndex(function finder(data) { return data === 'RFC:' });
                    const curp = Arreglo[curpIndex + 2];
                    let nombreIndex = Arreglo.findIndex(function finder(data) { return data === 'Denominación/Razón Social:' });
                    const nombre = Arreglo[nombreIndex + 2];
                    let estadoIndex = Arreglo.findIndex(function finder(data) { return data === 'Nombre de la Entidad Federativa:' });
                    const estado = Arreglo[estadoIndex + 2];
                    data = { tipo: page[5].str, curp, estado, nombre };
                    res.json(data);
                }
                else if(paginaString.includes("Nombre (s):")){
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
                else if (paginaString.includes("Acta de Defunción")) {
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
                else if (paginaString.includes("AVISO PARA RETENCIÓN DE DESCUENTOS") == true && paginaString.includes("POR ORIGINACIÓN DE CRÉDITO") == false) {
                    curp = paginaString[paginaString.length - 7];
                    nombreFull = paginaString[paginaString.length - 6];
                    nombre = nombreFull.split(' ')[0] + " " + nombreFull.split(' ')[1];
                    apellidos = nombreFull.split(' ')[2] + " " + nombreFull.split(' ')[3];
                    estado = paginaString[paginaString.length - 14].split(',')[1].split(' ')[1];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }
                else if (paginaString.includes("DE SUSPENSIÓN DE DESCUENTOS")) {
                    curp = paginaString[paginaString.length - 6];
                    nombre = paginaString[paginaString.length - 11];
                    nombreFull = paginaString[paginaString.length - 1];
                    apellidos = nombreFull.split(' ')[nombreFull.split(' ').length - 2] + " " + nombreFull.split(' ')[nombreFull.split(' ').length - 1];
                    nombre = nombreFull.split(' ')[0];
                    estado = paginaString[paginaString.length - 8].split(',')[1].split(' ')[1];
                    data = { tipo: "AVISO PARA RETENCIÓN DE DESCUENTOS", curp, estado, nombre, apellidos }
                    res.send(data)
                }
                else if (paginaString.includes("AVISO PARA RETENCIÓN DE DESCUENTOS") == true && paginaString.includes("POR ORIGINACIÓN DE CRÉDITO") == true) {
                    curp = paginaString[paginaString.length - 36];
                    nombreFull = paginaString[paginaString.length - 34];
                    nombre = nombreFull.split(' ')[nombreFull.split(' ').length - 1]
                    apellidos = nombreFull.split(' ')[0] + " " + nombreFull.split(' ')[1];
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

//Subir Registro de Actas
exports.newActaReg = async (req, res) => {
    const { document, state, dataset, nameinside, namefile, level0 } = req.body;
    const idcreated = req.usuarioID;
    try {
        //Encrypt Data
        var documentEncrypt = Encrypt.Document(document);
        var stateEncrypt = Encrypt.State(state);
        //Obtain All Users
        var users = await Users.findAll({ attributes: ['id', 'nombre', 'precios', 'idSuper'] });
        //Obtaint Levels
        var levels = Assigments.Levels(level0, users, documentEncrypt, stateEncrypt);
        //Add New Acta
        await actas_reg.create({
            document,
            state,
            dataset,
            nameinside,
            namefile,
            level0: levels[0].id,
            price0: levels[0].price,
            level1: levels[1].id,
            price1: levels[1].price,
            level2: levels[2].id,
            price2: levels[2].price,
            level3: levels[3].id,
            price3: levels[3].price,
            level4: levels[4].id,
            price4: levels[4].price,
            level5: levels[5].id,
            price5: levels[5].price,
            idcreated

        }, {
            fields: [
                'document',
                'state',
                'dataset',
                'nameinside',
                'namefile',
                'level0', 'price0',
                'level1', 'price1',
                'level2', 'price2',
                'level3', 'price3',
                'level4', 'price4',
                'level5', 'price5',
                'idcreated'
            ]
        }).then(data => {
            return res.status(201).json({ message: 'Acta Added!' });
        }).catch(err => {
            return res.status(500).json(err);
        });

    }
    catch (Ex) {
        console.log(Ex);
        res.status(500).json({ message: 'Internal Error!' });
    }
}

//Traspasar un Acta From Requests
exports.TransposeReg = async (req, res) => {
    const { id } = req.params;
    const { newciber, service } = req.body;
    const id_transpose = req.usuarioID;
    //Verify Service
    var search = "";
    if (service == "acta") {
        search = "Acta de";
    }
    else if (service == "rfc") {
        search = "Registro Federal";
    }
    else {
        return res.status(401).json({ message: 'Service No Found' });
    }
    //Search Reg
    const actaReg = await actas_reg.findOne({ where: { namefile: { [Op.like]: `${id}-%` }, document: { [Op.like]: `%${search}%` } } });
    if (actaReg) {
        const users = await Users.findAll({ attributes: ['id', 'nombre', 'precios', 'idSuper'] });
        var documentEncrypt = Encrypt.Document(actaReg.document);
        var stateEncrypt = Encrypt.State(actaReg.state);
        var levels = Assigments.Levels(newciber, users, documentEncrypt, stateEncrypt);
        actas_reg.update({
            level0: levels[0].id,
            price0: levels[0].price,
            level1: levels[1].id,
            price1: levels[1].price,
            level2: levels[2].id,
            price2: levels[2].price,
            level3: levels[3].id,
            price3: levels[3].price,
            level4: levels[4].id,
            price4: levels[4].price,
            level5: levels[5].id,
            price5: levels[5].price,
            idtranspose: id_transpose
        }, { where: { id: actaReg.id } }).then(data => {
            if (service == "acta") {
                actas_req.update({ idtranspose: id_transpose }, { where: { id } }).then(data2 => {
                    return res.status(200).json({ message: 'Updated!' });
                }).catch(err2 => {
                    return res.status(500).json({ message: 'Internal Error!' });
                });
            }
            else if (service == "rfc") {
                rfc_req.update({ idtranspose: id_transpose }, { where: { id } }).then(data2 => {
                    return res.status(200).json({ message: 'Updated!' });
                }).catch(err2 => {
                    return res.status(500).json({ message: 'Internal Error!' });
                });
            }
        }).catch(err => {
            return res.status(500).json({ message: 'Internal Error!' });
        });
    }
    else {
        return res.status(404).json({ message: 'Document no found!' });
    }
}

exports.TransposeFromItself = async (req, res) => {
    const { id } = req.params;
    const { newciber } = req.body;
    const id_transpose = req.usuarioID;

    const actaReg = await actas_reg.findOne({ where: {id: id} });
    if (actaReg) {
        const users = await Users.findAll({ attributes: ['id', 'nombre', 'precios', 'idSuper'] });
        var documentEncrypt = Encrypt.Document(actaReg.document);
        var stateEncrypt = Encrypt.State(actaReg.state);
        var levels = Assigments.Levels(newciber, users, documentEncrypt, stateEncrypt);
        actas_reg.update({
            level0: levels[0].id,
            price0: levels[0].price,
            level1: levels[1].id,
            price1: levels[1].price,
            level2: levels[2].id,
            price2: levels[2].price,
            level3: levels[3].id,
            price3: levels[3].price,
            level4: levels[4].id,
            price4: levels[4].price,
            level5: levels[5].id,
            price5: levels[5].price,
            idtranspose: id_transpose
        }, { where: { id: actaReg.id } }).then(data => {
                return res.status(200).json(levels);
        }).catch(err => {
            return res.status(500).json({ message: 'Internal Error!' });
        });
    }
    else {
        return res.status(404).json({ message: 'Document no found!' });
    }



}


//GetMy Historial de Registros
exports.getMyHistory = async (req, res) => {
    const idUser = req.usuarioID;
    const { date } = req.params;
    const users = await Users.findAll({ attributes: ['id', 'nombre'] });
    const actas = await actas_reg.findAll({
        where: { [Op.or]: [{ level0: idUser }, { level1: idUser }, { level2: idUser }, { level3: idUser }, { level4: idUser }, { level5: idUser }, { idcreated: idUser }], corte: Assigments.Dating(date) },
        order: [['id', 'ASC']]
    });
    if (actas) {
        var data = [];
        for (let i = 0; i < actas.length; i++) {
            var userCreated = users.find(element => {
                return element["id"] == Number(actas[i].idcreated);
            });
            var bought = users.find(element => {
                return element["id"] == Number(actas[i].level0);
            });
            var seller = users.find(element => {
                return element["id"] == Number(actas[i].level1);
            });

            data.push({
                "id": actas[i].id,
                "document": actas[i].document,
                "dataset": actas[i].dataset,
                "state": actas[i].state,
                "nameinside": actas[i].nameinside,
                "bought": bought,
                "seller": seller,
                "createdAt": Assigments.SubstractHours(5, new Date(actas[i].createdAt)),
                "corte": actas[i].corte,
                "uploadBy": userCreated
            });
        }
        return res.status(200).json(data);
    }
    else {
        return res.status(404).json({ message: 'No found!' });
    }
}

//Corte
exports.getDates = async (req, res) => {
    const idUser = req.usuarioID;
    actas_reg.findAll({
        where: {
            [Op.or]: [
                { level0: idUser },
                { level1: idUser },
                { level2: idUser },
                { level3: idUser },
                { level4: idUser },
                { level5: idUser }
            ]
        },
        attributes: ['corte'],
        group: ['corte'],
        order: [['corte', 'DESC']]
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.GetClientsOnDate = async (req, res) => {
    const { date } = req.params;
    const idUser = req.usuarioID;
    const users = await Users.findAll({ attributes: ['id', 'nombre'], order: [['id', 'ASC']] });
    const clients = await actas_reg.findAll({
        where: {
            [Op.or]: [
                { level1: idUser },
                { level2: idUser },
                { level3: idUser },
                { level4: idUser },
                { level5: idUser }
            ],
            corte: Assigments.Dating(date)
        },
        attributes: ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'],
        order: [['id', 'ASC']]
    });

    try {
        let ClientsAll = [];
        
        for (let i = 0; i < clients.length; i++) {

            if (clients[i].level1 == idUser) {
                if(clients[i].level0 != null){
                    ClientsAll.push(clients[i].level0);
                }
            }
            else if (clients[i].level2 == idUser) {
                if(clients[i].level1 != null){
                    ClientsAll.push(clients[i].level1);
                }
            }
            else if (clients[i].level3 == idUser) {
                if(clients[i].level2 != null){
                    ClientsAll.push(clients[i].level2);
                }
            }
            else if (clients[i].level4 == idUser) {
                if(clients[i].level3 != null){
                    ClientsAll.push(clients[i].level3);
                }
            }
            else if (clients[i].level5 == idUser) {
                if(clients[i].level4 != null){
                    ClientsAll.push(clients[i].level4);
                }
            }
        }

        ClientsAll = Assigments.DeleteDuplicates(ClientsAll);
        let ClientsData = [];

        for (let client = 0; client < ClientsAll.length; client++) {
            var user = users.find(element => {
                return element["id"] == Number(ClientsAll[client]);
            })
            try{
                ClientsData.push({
                    "id": user["id"],
                    "nombre": user["nombre"]
                });
            }
            catch{
                ClientsData.push({
                    "id": ClientsAll[client],
                    "nombre": `Usuario '${String(ClientsAll[client])}' Eliminado`
                });
            }


        }

        return res.status(200).json(ClientsData);
    }
    catch(Ex) {
        console.log(Ex);
        return res.status(200).json({ message: 'Internal Error!' });
    }


}

exports.getCorte = async (req, res) => {
    const { id, date } = req.params;
    const idUser = req.usuarioID;
    const users = await Users.findAll({ attributes: ['id', 'nombre'] });

    const actas = await actas_reg.findAll({
        where: {
            [Op.or]: [
                { level0: id },
                { level1: id },
                { level2: id },
                { level3: id },
                { level4: id },
                { level5: id }
            ],
            corte: Assigments.Dating(date)
        }
    });

    try {

        let corte = [];
        for (let i = 0; i < actas.length; i++) {
            var client = users.find(element => {
                return element["id"] == Number(actas[i].level0);
            });
            var superviser = users.find(element => {
                return element["id"] == Number(actas[i].level1);
            });

            var uploadBy = users.find(element => {
                return element["id"] == Number(actas[i].idcreated);
            });
            corte.push({
                "document": actas[i].document,
                "state": actas[i].state,
                "client": client,
                "superviser": superviser,
                "createdAt": Assigments.SubstractHours(5, new Date(actas[i].createdAt)) ,
                "dataset": actas[i].dataset,
                "nameinside": actas[i].nameinside,
                "uploadBy": uploadBy,
                "price": Assigments.Pricing(actas[i], idUser)

            });
        }
        res.status(200).json(corte);
    } catch {
        res.status(500).json({ message: 'Internal Error!' });
    }






}

//Historial
exports.getHistoryOnDate = async (req, res) => {
    const { date } = req.params;
    //id, vendedor, comprador, documento
    const idUser = req.usuarioID;
    const users = await Users.findAll({ attributes: ['id', 'nombre'] });

    const actas = await actas_reg.findAll({
        where: {
            [Op.or]: [
                { level0: idUser },
                { level1: idUser },
                { level2: idUser },
                { level3: idUser },
                { level4: idUser },
                { level5: idUser }
            ],
            corte: Assigments.Dating(date)
        }
    });

    try {
        if (actas) {
            let corte = [];
            for (let i = 0; i < actas.length; i++) {
                var client = users.find(element => {
                    return element["id"] == Number(actas[i].level0);
                });
                var superviser = users.find(element => {
                    return element["id"] == Number(actas[i].level1);
                });

                var uploadBy = users.find(element => {
                    return element["id"] == Number(actas[i].idcreated);
                });

                var cost = Assigments.Costing(actas[i], idUser);

                var seller = users.find(element => {
                    return element["id"] == Number(cost[2]);
                });

                var dateUTC = new Date( actas[i].createdAt);
                corte.push({
                    "id": actas[i].id,
                    "state": actas[i].state,
                    "document": actas[i].document,
                    "buy": cost[0],
                    "pay": cost[1],
                    "seller": seller,
                    "state": actas[i].state,
                    "client": client,
                    "superviser": superviser,
                    "createdAt":  Assigments.SubstractHours(5, dateUTC),
                    "dataset": actas[i].dataset,
                    "nameinside": actas[i].nameinside,
                    "uploadBy": uploadBy,
                    "price": Assigments.Pricing(actas[i], idUser),
                    "corte": actas[i].corte

                });
            }
            return res.status(200).json(corte);
        }
        else {
            return res.status(404).json({ message: 'No found!' });
        }
    } catch {
        res.status(500).json({ message: 'Internal Error!' });
    }
}

exports.Delete = async (req, res) => {
    const { id } = req.params;
    const idUser = req.usuarioID;
    const acta = await actas_reg.findOne({ where: { id } });
    if (acta) {
        await actas_trash.create({
            idsuper: Number(id),
            document: acta.document,
            state: acta.state,
            dataset: acta.dataset,
            nameinside: acta.nameinside,
            level0: acta.level0,
            price0: acta.price0,
            level1: acta.level1,
            price1: acta.price1,
            level2: acta.level2,
            price2: acta.price2,
            level3: acta.level3,
            price3: acta.price3,
            level4: acta.level4,
            price4: acta.price4,
            level5: acta.level5,
            price5: acta.price5,
            corte: acta.corte,
            send: acta.send,
            idcreated: acta.idcreated,
            idhidden: idUser,
            idtranspose: acta.idtranspose,
            createdAt: acta.createdAt,
            updatedAt: acta.updatedAt,
            namefile: acta.namefile,
        }, {
            fields: [
                'idsuper',
                'document',
                'state',
                'dataset',
                'nameinside',
                'namefile',
                'level0', 'price0',
                'level1', 'price1',
                'level2', 'price2',
                'level3', 'price3',
                'level4', 'price4',
                'level5', 'price5',
                'idcreated',
                'corte',
                'send',
                'idhidden',
                'idtranspose',
                'createdAt',
                'updatedAt',
                'namefile',
            ]
        }).then(data => {

            actas_reg.destroy({ where: { id } }).then(data2 => {
                return res.status(200).json({message: 'Deleted!'});
            }).catch(err2 => {
                return res.status(500).json({ message: 'Internal Error!' });
            });

            
        }).catch(err => {
            return res.status(500).json(err);
        });


        
    }
    else {
        return res.status(404).json({ message: 'No found!' });
    }

}

exports.ChangeDate = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    if (req.usuarioRol != "Cliente" && req.usuarioRol != "Capturista") {
        const acta = await actas_reg.findOne({where: {id:id}, attributes: ['createdAt'] });
        if(acta){
            // var currentDate = Assigments.SubstractHours(5, acta['createdAt']);
            // var newDate =  date+"T"+acta['createdAt'].toISOString().split('T')[1]; 
            // await actas_reg.update({ createdAt: newDate }, { where: { id } }).then(data => {
            //     if (data != 0) {
            //         return res.status(200).json({ message: 'Updated!' });
            //     }
            //     else {
            //         return res.status(404).json({ message: 'No found!' });
            //     }
            // }).catch(err => {
            //     return res.status(500).json(err);
            // });
        }
        else{
            return res.status(404).json({ message: 'No found!' });
        
        }

    }
    else {
        return res.status(500).json({ message: 'Dont have auth!' })
    }

}

// exports.newActaRegister = async (req, res) => {
//     /*
//     document
//     state
//     curp
//     nameinside
//     namefile
//     level0
//     idcreated:Token
//     */

//     var { document, state, curp, nameinside, namefile, level0 } = req.body;


//     if (!document && !state && !curp && !nameinside && !namefile && !level0) {
//         return res.status(500);
//     }
//     else {
//         const usuarios = await Users.findAll({ attributes: ['id', 'precios', 'idSuper'], group: ['id'] });

//         var encryptState = Encrypt.State(state);
//         var encryptDocument = Encrypt.Document(document);

//         //Setting to start from level 0
//         var datafull = [];
//         level0 = Number(level0);
//         var level1;
//         var level2;
//         var level3;
//         var level4;

//         var precio0;
//         var precio1;
//         var precio2;
//         var precio3;
//         var precio4;
//         var precio5;


//         /*  --  LEVELS --   */
//         for (let i = 0; i < 6; i++) {

//             var data = usuarios.find(element => {
//                 switch (i) {
//                     case 0:
//                         return element["id"] == level0;
//                         break;
//                     case 1:
//                         return element["id"] == level1;
//                         break;
//                     case 2:
//                         return element["id"] == level2;
//                         break;
//                     case 3:
//                         return element["id"] == level3;
//                         break;
//                     case 4:
//                         return element["id"] == level4;
//                         break;
//                     case 5:
//                         return element["id"] == level5;
//                         break;
//                     default:
//                         break;
//                 }
//             });
//             switch (i) {
//                 case 0:
//                     level1 = data.idSuper;
//                     try {
//                         if (typeof (data.precios[encryptDocument]) == "object") {
//                             precio0 = data.precios[encryptDocument][encryptState]
//                         }
//                         else if (typeof (data.precios[encryptDocument]) == "number") {
//                             precio0 = data.precios[encryptDocument]
//                         }
//                         else {
//                             precio0 = null;
//                         }
//                     } catch {
//                         precio0 = null;
//                     }


//                     break;
//                 case 1:
//                     level2 = data.idSuper;
//                     try {
//                         if (typeof (data.precios[encryptDocument]) == "object") {
//                             precio0 = data.precios[encryptDocument][encryptState]
//                         }
//                         else if (typeof (data.precios[encryptDocument]) == "number") {
//                             precio0 = data.precios[encryptDocument]
//                         }
//                         else {
//                             precio0 = null;
//                         }
//                     } catch {
//                         precio0 = null;
//                     }
//                     break;
//                 case 2:
//                     level3 = data.idSuper;
//                     try {
//                         if (typeof (data.precios[encryptDocument]) == "object") {
//                             precio0 = data.precios[encryptDocument][encryptState]
//                         }
//                         else if (typeof (data.precios[encryptDocument]) == "number") {
//                             precio0 = data.precios[encryptDocument]
//                         }
//                         else {
//                             precio0 = null;
//                         }
//                     } catch {
//                         precio0 = null;
//                     }
//                     break;
//                 case 3:
//                     level4 = data.idSuper;
//                     try {
//                         if (typeof (data.precios[encryptDocument]) == "object") {
//                             precio0 = data.precios[encryptDocument][encryptState]
//                         }
//                         else if (typeof (data.precios[encryptDocument]) == "number") {
//                             precio0 = data.precios[encryptDocument]
//                         }
//                         else {
//                             precio0 = null;
//                         }
//                     } catch {
//                         precio0 = null;
//                     }
//                     break;
//                 case 4:
//                     level5 = data.idSuper;
//                     break;
//                 case 5:
//                     level6 = data.idSuper;
//                     break;
//                 default:
//                     break;
//             }

//             let precio;

//             console.log(data);
//         }




//         /*   */






//         /* Precio Level0 */

//         var data0 = usuarios.find(element => {
//             return element["id"] == Number(level0);
//         });
//         let precio0;
//         let level1 = data0.idSuper;
//         try {
//             if (typeof (data0.precios[encryptDocument]) == "object") {
//                 precio0 = data0.precios[encryptDocument][encryptState]
//             }
//             else if (typeof (data0.precios[encryptDocument]) == "number") {
//                 precio0 = data0.precios[encryptDocument]
//             }
//             else {
//                 precio0 = null;
//             }
//         } catch {
//             precio0 = null;
//         }

//         /* Precio Level1 */
//         var data1 = usuarios.find(element => {
//             return element["id"] == Number(level1);
//         });
//         let precio1;
//         let level2 = data1.idSuper;
//         try {
//             if (typeof (data1.precios[encryptDocument]) == "object") {
//                 precio1 = data1.precios[encryptDocument][encryptState]
//             }
//             else if (typeof (data1.precios[encryptDocument]) == "number") {
//                 precio1 = data1.precios[encryptDocument]
//             }
//             else {
//                 precio1 = null;
//             }
//         } catch {
//             precio1 = null;
//         }



//         /* Precio Level2 */
//         var data2 = usuarios.find(element => {
//             return element["id"] == Number(level2);
//         });
//         let precio2;
//         let level3 = data2.idSuper;

//         try {
//             if (typeof (data2.precios[encryptDocument]) == "object") {
//                 precio2 = data2.precios[encryptDocument][encryptState]
//             }
//             else if (typeof (data2.precios[encryptDocument]) == "number") {
//                 precio2 = data2.precios[encryptDocument]
//             }
//             else {
//                 precio2 = null;
//             }
//         } catch {
//             precio2 = null;
//         }



//         /* Precio Level3 */
//         var data3 = usuarios.find(element => {
//             return element["id"] == Number(level3);
//         });
//         let precio3;
//         let level4 = data3.idSuper;
//         try {
//             if (typeof (data3.precios[encryptDocument]) == "object") {
//                 precio3 = data3.precios[encryptDocument][encryptState]
//             }
//             else if (typeof (data3.precios[encryptDocument]) == "number") {
//                 precio3 = data3.precios[encryptDocument]
//             }
//             else {
//                 precio3 = null;
//             }
//         } catch {
//             precio3 = null;
//         }


//         /* Precio Level4 */
//         var data4 = usuarios.find(element => {
//             return element["id"] == Number(level4);
//         });
//         let precio4;
//         let level5 = data4.idSuper;

//         try {
//             if (typeof (data4.precios[encryptDocument]) == "object") {
//                 precio4 = data4.precios[encryptDocument][encryptState]
//             }
//             else if (typeof (data4.precios[encryptDocument]) == "number") {
//                 precio4 = data4.precios[encryptDocument]
//             }
//             else {
//                 precio4 = null;
//             }
//         }
//         catch {
//             precio4 = null;
//         }







//         datafull.push({
//             "document": document,
//             "state": state,
//             "curp": curp,
//             "nameinside": nameinside,
//             "namefile": namefile,
//             "level0": level0,
//             "price0": precio0,
//             "level1": level1,
//             "price1": precio1,
//             "level2": level2,
//             "price2": precio2,
//             "level3": level3,
//             "price3": precio3,
//             "level4": level4,
//             "price4": precio4,
//         });




//         res.status(200).json(datafull);



//     }

// }


