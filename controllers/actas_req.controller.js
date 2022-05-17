const db = require("../models");
const actas_req = db.Actas_req;


exports.createARequest = async (req, res) => {
    const id_req = req.usuarioID;
    const { type, metadata } = req.body;
    await actas_req.create({
        type,
        metadata,
        id_req,
        send:false
    }, {fields: ['type', 'metadata', 'id_req']}).then(data => {
        res.status(201).json({message: 'Created!'})
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.getRequestNoAttended = async (req, res) => {
    await actas_req.findOne({where:{ send:false}}).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}