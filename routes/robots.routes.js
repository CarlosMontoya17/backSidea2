const controller = require("../controllers/robots.controller");
const updaterCaptcha = require("../middlewares/uploaderCaptcha");
const auth = require("../middlewares/auth");

module.exports = (app, socket) => {
    app.post("/api/robots/add/", auth.verify, controller.AddNewRobot);
    app.get("/api/robots/getAll/", auth.verify);


    //Socket Actas
    app.post("/api/robots/actas/emit/new/", (req, res) => {
        const emit = req.body;
        socket.emit('actas', emit);
        res.json(emit);
    });

    // //Socket Robot Controller
    // app.post("/api/robots/controller/instruction/new/", (req, res) => {
    //     const emit = req.body;
    //     socket.emit('instruction', emit);
    //     res.json(emit);
    // });

    //Socket Robot Controller
    app.post("/api/robots/controller/instruction/new/", (req, res) => {
        const emit = req.body;
        socket.emit('instruction', emit);
        res.json(emit);
    });


    //Socket Robot Status
    app.post("/api/robots/status/", (req, res, next) => {
        const { name, status } = req.body;
        socket.emit('status', {
            name, status
        });
        next();
    }, controller.setStatus);

    //Socket And Uploader Captcha
    app.put("/api/robots/captcha/up/:name", updaterCaptcha.upload.single('captcha'), controller.Captcha, (req, res) => {
        const { name } = req.params;
        socket.emit('captcha', {
            name
        });
        res.status(200).json({message: 'Updated!'});
    });

    //Captcha
    app.get("/api/robots/captcha/view/:name", auth.verify, controller.ViewCaptcha);

    app.put("/api/robots/captcha/resolve/:name", auth.verify, (req, res) => {
        const { captchaValue } = req.body;
        const { name } = req.params;
        if(captchaValue){
            socket.emit('captchaResolve', {
                name, captchaValue
            });
            return res.sendStatus(200);
        }
        else{
            return res.sendStatus(400);
        }

    });
}   