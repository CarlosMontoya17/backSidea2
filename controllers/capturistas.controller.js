const database = require("../models");
const Capturistas = database.Capturistas;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");


exports.signUp = async (req, res) => {
    const { usuario, password, avatar, email, telefono, estado } = req.body;
    try {
        let isAlready = await Capturistas.findOne({where: { usuario }}); 
        if(!isAlready){
            let salt = await bcryptjs.genSalt(10);
            let hashing = await bcryptjs.hash(password, salt);
            let user  = await Capturistas.create({
                usuario,
                password: hashing,
                avatar,
                email,
                telefono,
                estado,
                status: true
            }, { field: ['usuario', 'password', 'avatar', 'email', 'telefono', 'estado', 'status']});
    
            if(user){
                return res.status(201).json({
                    message: 'User Created',
                    data: user
                });
            }
        } 
        
        res.status(200).json({
            message: 'User already exist'
        });
    } catch (error) {
        res.status(500).json({message: error})
    }
}

exports.signIn = async (req, res) => {
    const { usuario, password } = req.body;
    let user = await Capturistas.findOne({where: { usuario }});
    if(!user){
        return res.status(404).json({
            message: "User don't found"
        });
    }
    let compare = bcryptjs.compareSync(password, user.password);
    if(!compare){
        return res.status(401).json({
            message: "Invalid password!"
        });
    }
    const token = jwt.sign({usuario: usuario, rol: user.rol}, cnfg.secret, {expiresIn: 60 * 60 * 24});
    res.status(200).json({
        token: token
    });
}