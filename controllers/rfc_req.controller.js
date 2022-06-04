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
    const data = await rfc_req.findOne({where: { [Op.or]: [{comments: null}, {comments: ""}]}, attributes: ['id', 'id_req', 'search', 'data']});
    if(data != null){
        res.status(200).json(data);
    }
    else{
        res.status(404).json({message: 'No Found!'});
    }
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
