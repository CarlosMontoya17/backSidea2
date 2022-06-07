const db = require("../models");
const rfc_req = db.Rfc_req;
const { Op } = require("sequelize");


exports.createOne = async (req, res) => {
    const { search, data } = req.body;
    await rfc_req.create({
        search,
        data,
        ip: req.ip,
        id_req: req.usuarioID
    },{field: ['search', 'data', 'ip', 'id_req']}).then(data => {
        if(data != 0){
            res.status(201).json({message: 'Created!'});
        }
    }).catch(err => {
        res.status(500).json({message: 'Internal Error!'});
    });
}



exports.getOneTask = async (req, res) => {
    const data = await rfc_req.findOne({where: { [Op.or]: [{comments: null}, {comments: ""}]}, attributes: ['id', 'id_req', 'search', 'data'], order: [['id', 'ASC']]});
    if(data != null){
        res.status(200).json(data);
    }
}

exports.getAllRequest = async (req, res) => {
    const id  = req.usuarioID;
    await rfc_req.findAll({where: {id_req: id}, order: [['id', 'ASC']]}).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({message: 'Internal Error!'});
    });

}

exports.addComments = async (req, res) => {
    const { comments } = req.body;
    const { id } = req.params;
    await rfc_req.update({comments}, {where: {id}}).then(data => {
        res.status(200).json({message: 'Updated!'});
    }).catch(err => {
        res.status(500).json({message: 'Internal Error!'});
    }); 


}

exports.upPdf = async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'No file!' });
    }
    else {
        const nameFile = req.file.originalname;
        var array = nameFile.split("-");
        var id = array[0];
        await rfc_req.update({
            namefile: nameFile
        }, { where: { id: Number(id) } }).then(data => {
            res.status(201).json({ message: 'Ready' });
        }).catch(err => {
            res.status(500).json({ message: 'Internal Error!' });
        });
    } 
}

exports.getMyData = async (req, res) => {
    const { id } = req.params;

    await rfc_req.findOne({where: {id}, attributes: ['id_req']}).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({message: 'Internal Error!'});
    });
}