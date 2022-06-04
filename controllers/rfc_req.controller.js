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
        res.status(500).json(err);
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