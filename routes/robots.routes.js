const controller = require("../controllers/robots.controller");
const auth = require("../middlewares/auth");

module.exports = (app, socket) => {
    app.post("/api/robots/add/", auth.verify, controller.AddNewRobot);

    //Socket Actas
    app.post("/api/robots/actas/emit/new/", (req, res) => {
        const emit = req.body;
        socket.emit('actas', emit);
        res.json(emit);
    });

    //Socket Robot Controller
    app.post("/api/robots/controller/instruction/new/", (req, res) => {
        const emit = req.body;
        socket.emit('instruction', emit);
        res.json(emit);
    });


    //Socket Robot Status
    app.post("/api/robots/status/", (req, res) => {
        const emit = req.body;
        socket.emit('status', emit);
        res.json(emit);
    });


}