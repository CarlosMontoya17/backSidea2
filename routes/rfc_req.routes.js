const controller = require("../controllers/rfc_req.controller");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderRFC = require("../middlewares/uploaderRFC");
const session = require("../middlewares/verifySession");
const auth = require("../middlewares/auth");

module.exports = (app, socket) => {
    app.post("/api/rfc/request/new/", verifyAuth, session.verifySession, controller.createOne);
    app.get("/api/rfc/request/getOne/", controller.getOneTask);

    app.get("/api/rfc/request/robots/1/getOne/", controller.getOneTaskRobot1);
    app.get("/api/rfc/request/robots/2/getOne/", controller.getOneTaskRobot2);
    app.get("/api/rfc/request/robots/3/getOne/", controller.getOneTaskRobot3);
    app.get("/api/rfc/request/robots/4/getOne/", controller.getOneTaskRobot4);


    app.put("/api/rfc/request/comment/:id", controller.addComments);
    app.get("/api/rfc/request/getMyData/:id", controller.getMyData);
    app.post("/api/rfc/request/robotUp/", uploaderRFC.upload.single('rfc'), controller.upPdf);
    app.get("/api/rfc/request/getMyRequest/", verifyAuth, session.verifySession, controller.getAllRequest);
    app.get("/api/rfc/request/donwload/:id", controller.getMyRFC);
    app.get("/api/rfc/requests/myDates/", verifyAuth, session.verifySession, controller.getMyDates);
    app.get("/api/rfc/requests/myRequests/:date", verifyAuth, session.verifySession, controller.getMyRequestesOnDate);

    //New Robots
    app.post("/api/rfc/requests/news/", auth.verify, controller.newRequest, (req, res) => {
        const request = req.entryReq;
        const robot = req.robotUser;
        socket.emit('rfcs', {
            "name": robot,
            "idrequest": request
        });
        res.json({
            "name": robot,
            "idrequest": request
        });
    });
    app.get("/api/rfc/requests/getData/:id", auth.verify, controller.getRequest);

    app.get("/api/rfc/requests/checkDesattend/:name", controller.checkReqDesattend);
}