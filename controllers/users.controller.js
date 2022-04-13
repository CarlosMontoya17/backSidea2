const database = require("../models");
const Users = database.Users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");


exports.signIn = async (req, res) => {
    const { username, password } = req.body;
    Users.findOne({
        where: {username}
    }).then(data => {
        if(!data){
            return res.status(404).json({
                message: 'User dont found'
            });
        }
        else{
            const validate = bcrypt.compareSync(password, data.password);
            if(!validate){
                return res.status(401).json({
                    message: 'Invalid Password'
                });
            }
            else{

                const token = jwt.sign({username: username}, cnfg.secret, {
                    expiresIn: 86400
                });
                res.status(200).json({
                    token: token
                });
            }
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Interal Error'
        });
    });
    
}



exports.getAll = async (req, res) => {

    Users.findAll().then(data => {
        res.status(200).send(data);
    }).catch(err =>{
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
    const { username, password, rol, type } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hasedPs = await bcrypt.hash(req.body.password, salt)
        let newUser = await Users.create({
            username,
            password: hasedPs,
            rol,
            type
        }, {
            fields: ['username', 'password', 'rol', 'type']
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

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await Users.destroy({
        where: { id }
    }).then(data => {
        console.log(data);
        res.json({
            message: 'User deleted'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Internal Error'
        });
    });
}

exports.updatedUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, rol, type } = req.body; 


    const salt = await bcrypt.genSalt(10);
    const hasedPs = await bcrypt.hash(password, salt)
    await Users.update({
        username, 
        password: hasedPs, 
        rol, 
        type
    }, {where: { id }}).then(data => {
        if(data == 0){
            res.sendStatus(500);
        }
        else{
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