const database = require("../models");
const Users = database.Users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");

exports.signIn = (req, res) => {
    const { username, password } = req.body;
    Users.findOne({
        where: { username }
    }).then(data => {
        if (!data) {
            return res.status(404).json({
                message: "User don't found"
            });
        }
        else {
            const validate = bcrypt.compareSync(password, data.password);
            if (!validate) {
                return res.status(401).json({
                    message: 'Invalid Password'
                });
            }
            else {

                const token = jwt.sign({ username: username, rol: data.rol }, cnfg.secret, {
                    expiresIn: 60 * 60 * 24
                });
                res.status(200).json({
                    token: token
                });
            }
        }
    }).catch(err => {
        res.status(500).json({
            message: err
        });
    });

}



exports.getAll = async (req, res) => {

    Users.findAll().then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).json({
            message: "Internal Error"
        })
    });
}

exports.getOne = async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({
        where: { id }
    });
    res.json({
        data: user
    });
}


exports.create = async (req, res) => {
    const { username, password, rol, type, idSuper } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hasedPs = await bcrypt.hash(req.body.password, salt)
        let newUser = await Users.create({
            username,
            password: hasedPs,
            rol,
            type,
            idSuper
        }, {
            fields: ['username', 'password', 'rol', 'type', 'idSuper']
        });
        if (newUser) {
            return res.status(201).json({
                message: 'User created',
                data: newUser
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'User dont created'
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    const rol = req.usuarioRol;
    if (rol != "admin") {
        res.status(401).json({
            message: "No have auth"
        });
    }
    else {
            const { id } = req.params;
            await Users.destroy({
                where: { id }
            }).then(data => {
                if(data == 0){
                    return res.status(404).json({
                        message: 'User dont found'
                    });
                }
                else{
                    return res.status(200).json({
                        message: 'User deleted'
                    });
                }
                
            }).catch(err => {
                console.log(err);
                return res.status(500).json({
                    message: 'Internal Error'
                });
            });
    }

}

exports.updatedUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, rol, type, idSuper } = req.body;


    const salt = await bcrypt.genSalt(10);
    const hasedPs = await bcrypt.hash(password, salt)
    await Users.update({
        username,
        password: hasedPs,
        rol,
        type,
        idSuper
    }, { where: { id } }).then(data => {
        if (data == 0) {
            res.sendStatus(500);
        }
        else {
            res.json({
                message: 'User was updated'

            });
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Error while user trying updated'
        });
    });
}