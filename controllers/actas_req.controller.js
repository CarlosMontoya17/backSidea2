const db = require("../models");
const actas_req = db.Actas_req;
const Users = db.Users;
const Op = db.Sequelize.Op;
const path = require('path');


var Assigments = {
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
    SubstractHours: (numofHours, date = new Date()) => {
            date.setHours(date.getHours() - numofHours);
            return date;
    }
}


exports.createARequest = async (req, res) => {
    const id_req = req.usuarioID;
    const datosUsuario = await Users.findOne({ where: { id: id_req }, attributes: ['servicios', 'idSuper', 'rol', 'username'] });
   
   
    if (datosUsuario.servicios == "actas" || datosUsuario.servicios == "all") {
        const { type, metadata, preferences } = req.body;
            if(id_req == 984){
                await actas_req.create({
                    type,
                    metadata,
                    id_req,
                    send: false,
                    preferences,
                    ip_req: req.ip,
                    robot: 2
                }, { fields: ['type', 'metadata', 'id_req', 'send', 'preferences', 'ip_req', 'robot'] }).then(data => {
                    return res.status(201).json({ message: 'Created!' })
                }).catch(err => {
                    return res.status(500).json(err);
                });
            }
            else{
                await actas_req.create({
                    type,
                    metadata,
                    id_req,
                    send: false,
                    preferences,
                    ip_req: req.ip,
                    robot: 1
                }, { fields: ['type', 'metadata', 'id_req', 'send', 'preferences', 'ip_req', 'robot'] }).then(data => {
                    return res.status(201).json({ message: 'Created!' })
                }).catch(err => {
                    return res.status(500).json(err);
                });
            }

        // if(id_req == 1509){
        //     await actas_req.create({
        //         type,
        //         metadata,
        //         id_req,
        //         send: false,
        //         preferences,
        //         ip_req: req.ip,
        //         robot: 2
        //     }, { fields: ['type', 'metadata', 'id_req', 'send', 'preferences', 'ip_req', 'robot'] }).then(data => {
        //         return res.status(201).json({ message: 'Created!' })
        //     }).catch(err => {
        //         return res.status(500).json(err);
        //     });
        // }
        // else{
        //     const allUser = await Users.findAll({ attributes: ['id', 'rol', 'username', 'idSuper'] });
        //     var usercurrent = datosUsuario;
        //     while (true) {
        //         var superuser = allUser.find(element => {
        //             return element["id"] == Number(usercurrent.idSuper);
        //         });
        //         usercurrent = superuser;
        //         if (superuser.rol != "Sucursal" && superuser.rol != "Empleado" && superuser.rol != "Cliente") {
        //             break;
        //         }
        //     }
        //     if(usercurrent.id == 1509){
        //         //Robot 2
        //         await actas_req.create({
        //             type,
        //             metadata,
        //             id_req,
        //             send: false,
        //             preferences,
        //             ip_req: req.ip,
        //             robot: 2
        //         }, { fields: ['type', 'metadata', 'id_req', 'send', 'preferences', 'ip_req', 'robot'] }).then(data => {
        //             return res.status(201).json({ message: 'Created!' })
        //         }).catch(err => {
        //             return res.status(500).json(err);
        //         });
        //     }
        //     else {
        //         res.send("1");
        //         //Robot 1
        //         await actas_req.create({
        //             type,
        //             metadata,
        //             id_req,
        //             send: false,
        //             preferences,
        //             ip_req: req.ip,
        //             robot: 1
        //         }, { fields: ['type', 'metadata', 'id_req', 'send', 'preferences', 'ip_req', 'robot'] }).then(data => {
        //             return res.status(201).json({ message: 'Created!' })
        //         }).catch(err => {
        //             return res.status(500).json(err);
        //         });
        //     }
        // }
    }
    else{
        return res.status(401).json({message: 'Unauthorized!'});
    }
    // if(id_req == 983){

    // }
    // else{
    //     res.status(500).json({message: 'NO HAVE AUTH!'})
    // }
    

    
}

exports.getRequestNoAttended = async (req, res) => {
    await actas_req.findOne({ where: { [Op.or]: [{comments: null}, {comments: ""}, {comments: " "}] }, attributes: ['id', 'type', 'metadata', 'id_req'], order: [['id', 'ASC']] }).then(data => {
        actas_req.update({ send: true }, { where: { id: data.id } });
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.getOneRobot1 = async (req, res) => {
    await actas_req.findOne({ where: { robot: 1, [Op.or]: [{comments: null}, {comments: ""}, {comments: " "}] }, attributes: ['id', 'type', 'metadata', 'id_req'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.getOneRobot2 = async (req, res) => {
    await actas_req.findOne({ where: { robot: 2, [Op.or]: [{comments: null}, {comments: ""}, {comments: " "}] }, attributes: ['id', 'type', 'metadata', 'id_req'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json(err);
    });
}

exports.getOneRobot3 = async (req, res) => {
    await actas_req.findOne({ where: { robot: 3, [Op.or]: [{comments: null}, {comments: ""}, {comments: " "}] }, attributes: ['id', 'type', 'metadata', 'id_req'], order: [['id', 'ASC']] }).then(data => {
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

    // if(id != 1){
    //     await actas_req.findAll({
    //         where: { id_req: id }, order: [['createdAt', 'DESC']]
    //     }).then(data => {
    //         res.status(200).json(data);
    //     }).catch(err => {
    //         res.status(500).json({
    //             message: 'Internal Error!'
    //         })
    //     });
    // }
    // else{
    //     await actas_req.findAll({
    //         order: [['createdAt', 'DESC']]
    //     }).then(data => {
    //         res.status(200).json(data);
    //     }).catch(err => {
    //         res.status(500).json({
    //             message: 'Internal Error!'
    //         })
    //     });
    // }

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
            url: path,
            downloaded: false
        }, { where: { id: Number(id) } }).then(data => {
            res.status(201).json({ message: 'Ready' });
        }).catch(err => {
            res.status(500).json({ message: 'Internal Error!' });
        });


    }

}

exports.whomRequested = async (req, res) => {
    const { id } = req.params;

    await actas_req.findOne({ where: { id }, attributes: ['id_req', 'preferences', 'metadata', 'type'] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });


}


exports.getMyActa = async (req, res) => {
    const { id } = req.params;

    await actas_req.findOne({ where: { id }, attributes: ['url'] }).then(data => {
        actas_req.update({downloaded: true}, { where: {id}}).then(data2 => {
            return res.sendFile(path.join(__dirname, "..", "assets", "actas", data.url));
        }).catch(err2 =>{
            return res.status(500).json(err);
        });
        

    }).catch(err => {
        res.status(500).json(err);
    });

}


exports.getMyDates = async (req, res) => {
    const idUser = req.usuarioID;
    await actas_req.findAll({where: {id_req: idUser}, attributes: ['corte'] , group: ['corte'], order: [['corte', 'DESC']]}).then(data => {
        res.status(200).json(data);
    }).catch(err => {   
        res.status(500).json({message: 'Internal Error!'});
    });

}


exports.getMyRequestesOnDate = async (req, res) => {
    const id = req.usuarioID;
    const { date } = req.params;
    await actas_req.findAll({
        where: { id_req: id, corte: Assigments.Dating(date)  }, order: [['createdAt', 'DESC']]
    }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({
            message: 'Internal Error!'
        })
    });
}