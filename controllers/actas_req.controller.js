const db = require("../models");
const actas_req = db.Actas_req;


exports.createARequest = async (req, res) => {
    const id_req = req.usuarioID;
    const { type, metadata } = req.body;

    console.log(id_req);
    await actas_req.create({
        type,
        metadata,
        id_req,
        send: false
    }, {fields: ['type', 'metadata', 'id_req', 'send']}).then(data => {
        res.status(201).json({message: 'Created!'})
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.getRequestNoAttended = async (req, res) => {
    await actas_req.findOne({where:{ send:false}, attributes: ['id','type', 'metadata']}).then(data => {
        if(data.length > 0){
            actas_req.update({send:true}, {where: {id:data.id}});
            res.status(200).json(data);
        }
        else{
            res.status(404).json({message: 'No found!'})
        }
        
        
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.commentsUp = async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;
    await actas_req.update({
        comments
    }, {where: { id }}).then(data => {
        res.status(200).json({message: 'Update!'});
    }).catch(err => {
        res.status(500).json({message: 'Internal Error!'});
    });
}