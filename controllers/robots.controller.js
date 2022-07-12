const db = require("../models");
const Users = db.Users;
const robots = db.Robots;
const Op = db.Sequelize.Op;


exports.AddNewRobot = async (req, res) => {
    const { name, source } = req.body;
    await robots.create({
        name,
        source
    }, {fields: ['name', 'source']}).then(data => {
        res.send(data);
    }).catch(err => {
        res.send(err);
    });
}


exports.NewInstruction = async (req, res) => {
    const { instruction } = req.body;
    const id = req.params;
    await robots.update({
        instruction
    },{where: {id}}).then(data => {
        if(data != 0){
            res.status(200).json({message: "Updated!"});
        }
        else{
            res.status(404).json({message: "No Found!"});
        }
    }).catch(err => {
        res.status(500).json({message: "Internal Error!"});
    });
}


