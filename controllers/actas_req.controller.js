const db = require("../models");
const actas_req = db.Actas_req;
const path = require('path');

exports.createARequest = async (req, res) => {
    const id_req = req.usuarioID;
    const { type, metadata } = req.body;

    console.log(id_req);
    await actas_req.create({
        type,
        metadata,
        id_req,
        send: false
    }, { fields: ['type', 'metadata', 'id_req', 'send'] }).then(data => {
        res.status(201).json({ message: 'Created!' })
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.getRequestNoAttended = async (req, res) => {
    await actas_req.findOne({ where: { send: false }, attributes: ['id', 'type', 'metadata', 'id_req'] }).then(data => {
        actas_req.update({ send: true }, { where: { id: data.id } });
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.commentsUp = async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    await actas_req.update({
        comments
    }, { where: { id } }).then(data => {
        res.status(200).json({ message: 'Update!' });
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}


exports.obtainAllRequets = async (req, res) => {
    const id = req.usuarioID;
    await actas_req.findAll({
        where: { id_req: id }, order: [['createdAt', 'DESC']]
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({
            message: 'Internal Error!'
        })
    });
}

exports.upPDF = async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'No file!' });
    }
    else {
        const nameFile = req.file.originalname;
        var array = nameFile.split("-");
        var id = array[0];
        var path = nameFile
        await actas_req.update({
            url: path
        }, { where: { id: Number(id) } }).then(data => {
            res.status(201).json({ message: 'Ready' });
        }).catch(err => {
            res.status(500).json({ message: 'Internal Error!' });
        });


    }

}


exports.getMyActa = async (req, res) => {
    const { id } = req.params;

    await actas_req.findOne({ where: { id }, attributes: ['url'] }).then(data => {

        res.sendFile( path.join(__dirname, "..", "assets", "actas", data.url) );

    }).catch(err => {
        res.status(500).json(err);
    });

}