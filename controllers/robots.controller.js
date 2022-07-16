const db = require("../models");
const Users = db.Users;
const robots = db.Robots;
const Op = db.Sequelize.Op;
const path = require('path');

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


exports.setStatus = async (req, res) => {
    const { name, status } = req.body;
    await robots.update({
        status
    }, {where: { name }}).then(data => {
        if(data != 0){
            return res.status(200).json({message: "Updated!"});
        }
        else{
            return res.status(404).json({message: "No Found!"});
        }
    }).catch(err => {
        res.status(500).json({message: "Internal Error!"});
    });

}

exports.Captcha = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        res.status(500).json({ message: 'No file!' });
    }
    else {
        const nameFile = req.file.originalname;
        const { name } = req.params;
        await robots.update({
            asset: nameFile
        }, {where: {name}}).then(data => {
            if(data != 0){
                next();
            }
            else{
                res.status(404).json({message: "No Found!"});
            }
        }).catch(err => {
            res.status(500).json({ message: 'No file!' });
        });
    }
}

exports.ViewCaptcha = async (req, res) => {
    const { name } = req.params;
    await robots.findOne({ where: { name }, attributes: ['asset'] }).then(data => {
        res.sendFile(path.join(__dirname, "..", "assets", "robots" , "captchas", data.asset));
    }).catch(err => {
        res.status(500).json(err);
    });
};

// exports.ResolveCaptcha = async (req, res) => {
//     const { name } = req.params;
//     await robots.update({ asset: null },{ where: { name }}).then(data => {
//         if(data != 0){
            
//             return res.status(200).json({message: "Updated!"});
//         }
//         else{
//             return res.status(404).json({message: "No Found!"});
//         }
//     }).catch(err => {
//         res.status(500).json(err);
//     });
// }