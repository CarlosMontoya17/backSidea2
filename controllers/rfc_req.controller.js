const db = require("../models");
const rfc_req = db.Rfc_req;
const Users = db.Users;
const robots = db.Robots;
const { Op } = require("sequelize");
const path = require("path");

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

exports.createOne = async (req, res) => {
    const idUsuario = req.usuarioID;

    const datosUsuario = await Users.findOne({ where: { id: idUsuario }, attributes: ['servicios', 'idSuper', 'rol', 'username'] });



    if (datosUsuario.servicios == "rfc" || datosUsuario.servicios == "all") {

        if (idUsuario == 1324) {
            //Robot 2
            const { search, data } = req.body;
            await rfc_req.create({
                search,
                data,
                ip: req.ip,
                id_req: req.usuarioID,
                robot: 2
            }, { field: ['search', 'data', 'ip', 'id_req', 'robot'] }).then(data => {
                if (data != 0) {
                    return res.status(201).json({ message: 'Created!' });
                }
            }).catch(err => {
                return res.status(500).json({ message: 'Internal Error!' });
            });
        }
        else if (idUsuario == 1509) {
            //Robot 3
            const { search, data } = req.body;
            await rfc_req.create({
                search,
                data,
                ip: req.ip,
                id_req: req.usuarioID,
                robot: 3
            }, { field: ['search', 'data', 'ip', 'id_req', 'robot'] }).then(data => {
                if (data != 0) {
                    return res.status(201).json({ message: 'Created!' });
                }
            }).catch(err => {
                return res.status(500).json({ message: 'Internal Error!' });
            });
        }
        else if(idUsuario == 1621){
            const { search, data } = req.body;
            await rfc_req.create({
                search,
                data,
                ip: req.ip,
                id_req: req.usuarioID,
                robot: 4
            }, { field: ['search', 'data', 'ip', 'id_req', 'robot'] }).then(data => {
                if (data != 0) {
                    return res.status(201).json({ message: 'Created!' });
                }
            }).catch(err => {
                return res.status(500).json({ message: 'Internal Error!' });
            });
        }
        else {
            const allUser = await Users.findAll({ attributes: ['id', 'rol', 'username', 'idSuper'] });
            var usercurrent = datosUsuario;
            while (true) {
                var superuser = allUser.find(element => {
                    return element["id"] == Number(usercurrent.idSuper);
                });
                usercurrent = superuser;
                if (superuser.rol != "Sucursal" && superuser.rol != "Empleado" || superuser.id == 1509) {
                    break;
                }
            }
            if (usercurrent.id == 1509) {
                //Robot 3
                const { search, data } = req.body;
                await rfc_req.create({
                    search,
                    data,
                    ip: req.ip,
                    id_req: req.usuarioID,
                    robot: 3
                }, { field: ['search', 'data', 'ip', 'id_req', 'robot'] }).then(data => {
                    if (data != 0) {
                        return res.status(201).json({ message: 'Created!' });
                    }
                }).catch(err => {
                    return res.status(500).json({ message: 'Internal Error!' });
                });
            }

            else if (usercurrent.id == 1324) {
                //Robot 2
                const { search, data } = req.body;
                await rfc_req.create({
                    search,
                    data,
                    ip: req.ip,
                    id_req: req.usuarioID,
                    robot: 2
                }, { field: ['search', 'data', 'ip', 'id_req', 'robot'] }).then(data => {
                    if (data != 0) {
                        return res.status(201).json({ message: 'Created!' });
                    }
                }).catch(err => {
                    return res.status(500).json({ message: 'Internal Error!' });
                });
            }
            else {
                //Robot 1
                const { search, data } = req.body;
                await rfc_req.create({
                    search,
                    data,
                    ip: req.ip,
                    id_req: req.usuarioID,
                    robot: 1
                }, { field: ['search', 'data', 'ip', 'id_req', 'robot'] }).then(data => {
                    if (data != 0) {
                        return res.status(201).json({ message: 'Created!' });
                    }
                }).catch(err => {
                    return res.status(500).json({ message: 'Internal Error!' });
                });
            }
        }
    }
    else {
        return res.status(401).json({ message: 'Unauthorized!' });
    }
}

exports.getOneTaskRobot4 = async (req, res) => {
    await rfc_req.findOne({ where: { robot: 4, [Op.or]: [{ comments: null }, { comments: "" }] }, attributes: ['id', 'id_req', 'search', 'data'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}

exports.getOneTaskRobot1 = async (req, res) => {
    await rfc_req.findOne({ where: { robot: 1, [Op.or]: [{ comments: null }, { comments: "" }] }, attributes: ['id', 'id_req', 'search', 'data'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}

exports.getOneTaskRobot2 = async (req, res) => {
    await rfc_req.findOne({ where: { robot: 2, [Op.or]: [{ comments: null }, { comments: "" }] }, attributes: ['id', 'id_req', 'search', 'data'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}

exports.getOneTaskRobot3 = async (req, res) => {
    await rfc_req.findOne({ where: { robot: 3, [Op.or]: [{ comments: null }, { comments: "" }] }, attributes: ['id', 'id_req', 'search', 'data'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}

exports.getOneTask = async (req, res) => {
    await rfc_req.findOne({ where: { [Op.or]: [{ comments: null }, { comments: "" }] }, attributes: ['id', 'id_req', 'search', 'data'], order: [['id', 'ASC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });

}

exports.getAllRequest = async (req, res) => {
    const id = req.usuarioID;
    await rfc_req.findAll({ where: { id_req: id }, order: [['id', 'DESC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });

}

exports.addComments = async (req, res) => {
    const { comments } = req.body;
    const { id } = req.params;
    await rfc_req.update({ comments }, { where: { id } }).then(data => {
        res.status(200).json({ message: 'Updated!' });
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
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
            namefile: nameFile,
            downloaded: false
        }, { where: { id: Number(id) } }).then(data => {
            res.status(201).json({ message: 'Ready' });
        }).catch(err => {
            res.status(500).json({ message: 'Internal Error!' });
        });
    }
}

exports.getMyData = async (req, res) => {
    const { id } = req.params;

    await rfc_req.findOne({ where: { id }, attributes: ['id_req'] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}


exports.getMyRFC = async (req, res) => {
    const { id } = req.params;

    await rfc_req.findOne({ where: { id }, attributes: ['namefile'] }).then(data => {
        rfc_req.update({ downloaded: true }, { where: { id } }).then(data2 => {
            return res.sendFile(path.join(__dirname, "..", "assets", "rfc", data.namefile));
        }).catch(err2 => {
            return res.status(500).json(err);
        });
    }).catch(err => {
        return res.status(500).json(err);
    });
}   


exports.getMyDates = async (req, res) => {
    const idUser = req.usuarioID;
    
    await rfc_req.findAll({where: {id_req: idUser}, attributes: ['corte'] , group: ['corte'], order: [['corte', 'DESC']]}).then(data => {
        res.status(200).json(data);
    }).catch(err => {   
        res.status(500).json({message: 'Internal Error!'});
    });

}


exports.getMyRequestesOnDate = async (req, res) => {
    const id = req.usuarioID;
    const { date } = req.params;
    
    await rfc_req.findAll({ where: { id_req: id, corte: Assigments.Dating(date) }, order: [['id', 'DESC']] }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({ message: 'Internal Error!' });
    });
}


exports.newRequest = async (req, res, next) => {
    const id_req = req.usuarioID;
    const datosUsuario = await Users.findOne({ where: { id: id_req }, attributes: ['servicios', 'idSuper', 'rol', 'username'] });
   
    if (datosUsuario.servicios == "rfc" || datosUsuario.servicios == "all") {
        const robot = await robots.findOne({where: {source: "rfcs", status: "Esperando Solicitudes"}, attributes: ['name']});
        var robotname = null;
        try{
            robotname = robot["name"];
        }
        catch{
            robotname = null;
        }
        const { search, data } = req.body;
        await rfc_req.create({
            search,
            data,
            ip: req.ip,
            id_req: req.usuarioID,
            robottaken: robotname
        }, { field: ['search', 'data', 'ip', 'id_req', 'robottaken'] }).then(data => {
                req.robotUser = robotname;
                req.entryReq = data.id;
                next();
        }).catch(err => {
            return res.status(500).json({ message: 'Internal Error!' });
        });
             
    }
    else{
        return res.status(401).json({message: 'Unauthorized!'});
    }

    
}


exports.checkReqDesattend = async (req, res) => {
    const { name } = req.params;
    await rfc_req.findOne({ where: { [Op.and]: [{[Op.or]: [{comments: null}, {comments: ""}, {comments: " "}]}, {[Op.or]: [{robottaken: name}, {robottaken: null}]}], clasification: {[Op.not]: null} }, attributes: ['id', 'search', 'data', 'id_req', 'clasification'], order: [['id', 'ASC']] }).then(data => {
        if(data != null){
            rfc_req.update({robottaken: name},{where: { id: data.id }}).then(data2 => {
                res.status(200).json(data);
            }).catch(err2 => {
                res.status(500).json(err2);
            });
        }
        else{
            return res.status(200).json(null);
        }

    }).catch(err => {
        res.status(500).json(err);
    });
}