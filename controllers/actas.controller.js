const database = require("../models");
const Actas = database.Actas;
const Users = database.Users;
const Op = database.Sequelize.Op;
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
            
            let newActa = await Actas.create({ enterprise, provider, document, states, curp, nombreacta, requested, idcreated: req.usuarioID, price, hidden: false },
                { field: ['enterprise', 'provider', 'document', 'states', 'curp', 'nombreacta', 'requested', 'idcreated', 'price', 'hidden'] });
            if (newActa) {
                res.status(201).json({message: 'Acta Added!'});
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
}


exports.getMyDatesCuts = async (req, res) => {
    const {id} = req.params;
    const data = await Actas.findAll({where: { enterprise: id }, group: ['corte'], attributes: ['corte']});
    if(data.length != 0){
        return res.status(200).json(data);
    }
    else{
        return res.status(404).json({
            message: 'No found'
        })
    }
}

exports.getCorteDate = async (req, res) => {
    const { id, date } = req.params;
    if(date == "null"){
        await Actas.findAll({where: {enterprise: id, corte: {[Op.is]: null}}, order: [['id', 'ASC']]}).then(data => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
    else{
        await Actas.findAll({where: {enterprise: id, corte: date}, order: [['id', 'ASC']]}).then(data => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
}
exports.getCorte = async (req, res) => {
    const { id, date } = req.params;
    const idToken = req.usuarioID;
    const myData = await Users.findOne({where: {id }, attributes: ["rol"]});


    if(date == "null"){
        await Actas.findAll({where: {[Op.or]: [{enterprise: id}, {provider: id}, {idsup1: id}, {idsup2:id}] , corte: {[Op.is]: null}}, order: [['id', 'ASC']]}).then(data => {
            let dataFull = []
            for (let i = 0; i < data.length; i++) {
                let precio;
                if(idToken == data[i].provider){
                    precio = data[i].price
                }
                else if(idToken == data[i].idsup1){
                    precio = data[i].preciosup1
                }
                else if(idToken == data[i].idsup2){
                    precio = data[i].preciosup2
                }
                arreglo = {"document": data[i].document, "createdAt": data[i].createdAt, "states": data[i].states, "nombreacta":data[i].nombreacta, "curp": data[i].curp, "price": precio }
                dataFull.push(arreglo);
            }
            return res.status(200).json(dataFull);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
    else{
        
        await Actas.findAll({where: {[Op.or]: [{enterprise: id}, {provider: id}, {idsup1: id}, {idsup2:id}] , corte: date}, order: [['id', 'ASC']]}).then(data => {
            let dataFull = []
            for (let i = 0; i < data.length; i++) {
                let precio;
                if(idToken == data[i].provider){
                    precio = data[i].price
                }
                else if(idToken == data[i].idsup1){
                    precio = data[i].preciosup1
                }
                else if(idToken == data[i].idsup2){
                    precio = data[i].preciosup2
                }
                arreglo = {"document": data[i].document, "createdAt": data[i].createdAt, "states": data[i].states, "nombreacta":data[i].nombreacta, "curp": data[i].curp, "price": precio }
                dataFull.push(arreglo);
            }
            return res.status(200).json(dataFull);
        }).catch(err => {
            return res.status(500).json(err);
        });
    }
}



exports.getMyCorte = async (req, res) => {
    const id  = req.params.id;
    if(id == "1"){
        const actas = await Actas.findAll({order:[['id', 'ASC']]});
        const usuarios = await Users.findAll({attributes : ['id', 'nombre']});
        let data = []
        for (let i = 0; i < actas.length; i++) {

            var currentUser = usuarios.find(element => { 
                return element["id"] == Number(actas[i].provider); 
            });
            var currentProvider = usuarios.find(element => { 
                return element["id"] == Number(actas[i].enterprise); 
            });
            
            data.push({
                        "id": actas[i].id, 
                        "document": actas[i].document, 
                        "curp": actas[i].curp, 
                        "states": actas[i].states,
                        "nombreacta": actas[i].nombreacta,
                        "provider": currentProvider.nombre,
                        "enterprise": currentUser.nombre,
                        "createdAt": actas[i].createdAt,
                        "price": actas[i].price
                    });
        }
        res.status(200).json(data);
                
    }
    
    else{
        const actas = await Actas.findAll({where: { [Op.or]: [{idcreated: id},{provider: id}] }, order:[['id', 'ASC']]});
        const usuarios = await Users.findAll({attributes : ['id', 'nombre']});
        let data = []
        for (let i = 0; i < actas.length; i++) {

            var currentUser = usuarios.find(element => { 
                return element["id"] == Number(actas[i].provider); 
            });
            var currentProvider = usuarios.find(element => { 
                return element["id"] == Number(actas[i].enterprise); 
            });
            
            data.push({
                        "id": actas[i].id, 
                        "document": actas[i].document, 
                        "curp": actas[i].curp, 
                        "states": actas[i].states,
                        "nombreacta": actas[i].nombreacta,
                        "provider": currentProvider.nombre,
                        "enterprise": currentUser.nombre,
                        "createdAt": actas[i].createdAt,
                        "price": actas[i].price
                    });
        }
        res.status(200).json(data);
    }
    
}

exports.getCorteForOne = async (req, res) => {
    const { id } = req.params;
    await Actas.findAll({where: { enterprise: id }, order: [['id', 'ASC']]}).then(data => {
        if(data.length != 0){
            res.status(200).json(data);
        }
        else{
            res.status(404).json({message: "No found"});
        }
    }).catch(err => {
        res.status(500).json({message: "Internal error!"});
    });


}

exports.countMyActasEnterprise = async (req, res) => {
        const { id } = req.params;
        data = {};
        //Nac
        const nac = await Actas.findAndCountAll({where: {enterprise: id, document: 'Acta de Nacimiento'}});
        data.nac = nac['count'];
        //Mat
        const mat = await Actas.findAndCountAll({where: {enterprise: id, document: 'Acta de Matrimonio'}});
        data.mat = mat['count'];
        //Div
        const div = await Actas.findAndCountAll({where: {enterprise: id, document: 'Acta de Divorcio'}});
        data.div = div['count'];
        //Def
        const def = await Actas.findAndCountAll({where: {enterprise: id, document: 'Acta de Defunción'}});
        data.def = def['count'];
        //RFC
        const rfc = await Actas.findAndCountAll({where: {enterprise: id, document: 'Registro Federal de Contribuyentes'}});
        data.rfc = rfc['count'];
        //Cot
        const cot = await Actas.findAndCountAll({where: {enterprise: id, document: 'Constancia de Semanas Cotizadas en el IMSS'}});
        data.cot = cot['count'];
        //Der
        const der = await Actas.findAndCountAll({where: {enterprise: id, document: 'Constancia de Vigencia de Derechos'}});
        data.der = der['count'];
        //INH
        const inh = await Actas.findAndCountAll({where: {enterprise: id, document: 'CONSTANCIA DE NO INHABILITACIÓN'}});
        data.inh = inh['count'];
        //NSS
        const nss = await Actas.findAndCountAll({where: {enterprise: id, document: 'Asignación de Número de Seguridad Social'}});
        data.nss = nss['count'];
        data.total = data.nac+data.mat+data.div+data.def+data.rfc+data.cot+data.der+data.inh+data.nss;
        res.json(data);
}

exports.countMyActasProvider = async (req, res) => {
    const { id } = req.params;
    data = {};
    //Nac
    const nac = await Actas.findAndCountAll({where: {provider: id, document: 'Acta de Nacimiento'}});
    data.nac = nac['count'];
    //Mat
    const mat = await Actas.findAndCountAll({where: {provider: id, document: 'Acta de Matrimonio'}});
    data.mat = mat['count'];
    //Div
    const div = await Actas.findAndCountAll({where: {provider: id, document: 'Acta de Divorcio'}});
    data.div = div['count'];
    //Def
    const def = await Actas.findAndCountAll({where: {provider: id, document: 'Acta de Defunción'}});
    data.def = def['count'];
    //RFC
    const rfc = await Actas.findAndCountAll({where: {provider: id, document: 'Registro Federal de Contribuyentes'}});
    data.rfc = rfc['count'];
    //Cot
    const cot = await Actas.findAndCountAll({where: {provider: id, document: 'Constancia de Semanas Cotizadas en el IMSS'}});
    data.cot = cot['count'];
    //Der
    const der = await Actas.findAndCountAll({where: {provider: id, document: 'Constancia de Vigencia de Derechos'}});
    data.der = der['count'];
    //INH
    const inh = await Actas.findAndCountAll({where: {provider: id, document: 'CONSTANCIA DE NO INHABILITACIÓN'}});
    data.inh = inh['count'];
    //NSS
    const nss = await Actas.findAndCountAll({where: {provider: id, document: 'Asignación de Número de Seguridad Social'}});
    data.nss = nss['count'];
    data.total = data.nac+data.mat+data.div+data.def+data.rfc+data.cot+data.der+data.inh+data.nss;
    res.json(data);
}



exports.clientsCurrent = async (req, res) => {
    const  id  = JSON.stringify(req.usuarioID);
    
    const data = [];
    const enterprisesId = await Actas.findAll({where: { provider: id }, attributes: ['enterprise'], group: ['enterprise']});

    for (let i = 0; i < enterprisesId.length; i++) {
        var enterprisesName = await Users.findOne({where: { id:enterprisesId[i]["enterprise"] }, attributes: ['nombre']});
        data.push({"id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"]})
    }

    if(data.length != 0){
        res.status(200).json(data);
    }
    else{
        res.status(404).json({message: "No found!"})
    }   
    


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


exports.deleteActa = async (req, res) => {
    const rol = req.usuarioRol;
    if (rol == "") {
        res.status(401).json({
            message: "Don't have auth"
        });
    }
    else {
        const { id } = req.params;
        await Actas.destroy({
            where: { id }
        }).then(data => {
            if (data == 0) {
                return res.status(404).json({
                    message: 'Acta dont found'
                });
            }
            else {
                return res.status(200).json({
                    message: 'Acta deleted'
                });
            }

        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Error'
            });
        });
    }
}


exports.documentsLevel = async (req, res) => {
    const id = JSON.stringify(req.usuarioID);
    const { level } = req.params;
    const data = [];

    if(level == "0"){
        const enterprisesId = await Actas.findAll({where: { provider: id }, attributes: ['enterprise'], group: ['enterprise']});

        for (let i = 0; i < enterprisesId.length; i++) {
            var enterprisesName = await Users.findOne({where: { id:enterprisesId[i]["enterprise"] }, attributes: ['nombre']});
            data.push({"id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"]})
        }
    
        if(data.length != 0){
            return res.status(200).json(data);
        }
        else{
            return res.status(404).json({message: "No found!"})
        }   
    }

    else if(level == "1"){
        const enterprisesId = await Actas.findAll({where: { idsup1: id }, attributes: ['enterprise'], group: ['enterprise'],});

        for (let i = 0; i < enterprisesId.length; i++) {
            var enterprisesName = await Users.findOne({where: { id:enterprisesId[i]["enterprise"] }, attributes: ['nombre']});
            data.push({"id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"]})
        }
    
        if(data.length != 0){
            return res.status(200).json(data);
        }
        else{
            return res.status(404).json({message: "No found!"})
        }   
    }
    else if(level == "2"){
        const enterprisesId = await Actas.findAll({where: { idsup2: id }, attributes: ['enterprise'], group: ['enterprise'],});

        for (let i = 0; i < enterprisesId.length; i++) {
            var enterprisesName = await Users.findOne({where: { id:enterprisesId[i]["enterprise"] }, attributes: ['nombre']});
            data.push({"id": enterprisesId[i]["enterprise"], "nombre": enterprisesName["nombre"]})
        }
    
        if(data.length != 0){
            return res.status(200).json(data);
        }
        else{
            return res.status(404).json({message: "No found!"})
        }   
    }
    else{
        res.status(404).json({
            message: 'No found'
        })
    }

}


exports.lowerToCut = async (req, res) => {
    const  id  = req.usuarioID;
    const idLower = await Users.findAll({where: {idSuper: id}, attributes:['id', 'nombre'], group:['id']});
    if(idLower.length != 0){
        const data = [];
        for (let i = 0; i < idLower.length; i++) {
            const idCurrent = JSON.stringify(idLower[i].id)
            var profile = await Actas.findOne({where : {[Op.or]: [{idsup2: idCurrent},{idsup1: idCurrent},{provider: idCurrent},{enterprise: idCurrent}]}})
            if(profile != null){
                data.push({"id": idCurrent, "nombre": idLower[i].nombre})
            }
        }
        if(data){
            res.status(200).json(data);
        }
    }   
    else{
        res.status(404).json({message: 'No found'})
    }
}

exports.historialDate = async (req, res) => {
    const { id } = req.params;
    const data = await Actas.findAll({where: { [Op.or]: [{provider: id}, {enterprise: id} ,{idsup1: id}, {idsup2:id}]  }, group: ['corte'], attributes: ['corte']});
    if(data.length != 0){
        return res.status(200).json(data);
    }
    else{
        return res.status(404).json({
            message: 'No found'
        })
    }

}

