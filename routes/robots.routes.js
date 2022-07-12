const controller = require("../controllers/robots.controller");
const auth = require("../middlewares/auth");

module.exports = (app, socket) => {
    app.post("/api/robots/add/", auth.verify ,controller.AddNewRobot);

    //Socket
    app.post("/api/robots/emit/", (req, res) => {
        const emit = req.body;
        socket.emit('robot', emit);
        res.json(emit);
    });



}