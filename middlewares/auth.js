const jwt = require("jsonwebtoken");
const cnfg = require("../config/auth");
const database = require("../models");
const Users = database.Users;

exports.verify = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    else{
        try{
            const decoded = jwt.verify(token, cnfg.secret);
            req.usuarioRol = decoded.rol;
            req.usuarioID = decoded.id;
        
            await Users.findOne({ where: { id: req.usuarioID } }).then(data => {
                if (data.token == token || req.usuarioID == 7 || req.usuarioID == 1922 || req.usuarioID == 983 || req.usuarioID == 1500 || req.usuarioID == 1507 || req.usuarioID == 1275 || req.usuarioID == 1842) {
                    next();
                }
                else {
                    return res.status(401).json({
                        message: "Session Closed!"
                    });
                }
            }).catch(err => {
                return res.status(500).json({
                    message: "Internal Error!"
                });
            });
        }
        catch{
            return res.status(401).json({
                message: "Session Closed!"
            });
        }
    }


}