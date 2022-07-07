const database = require("../models");
const Users = database.Users;

exports.verifySession = async (req, res, next) => {
    
    const id = req.usuarioID;
    const token = req.headers['x-access-token'];

    await Users.findOne({ where: { id: id } }).then(data => {
        if (data.token == token) {
            next();
        }
        else {
            return res.status(401).json({
                message: "No Identificated!"
            });
        }
    }).catch(err => {
        return res.status(500).json({
            message: "Internal Error!"
        });
    });
}