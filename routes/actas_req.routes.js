const controller = require("../controllers/actas_req.controller");
//MW
const auth = require("../middlewares/auth");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderActa = require("../middlewares/uploaderActa");
const session = require("../middlewares/verifySession");

module.exports = (app) => {
    app.get("/api/actas/requests/obtainAll/", verifyAuth, session.verifySession,controller.obtainAllRequets);
    app.post("/api/actas/requests/createOne/", verifyAuth, session.verifySession, controller.createARequest);
    app.get("/api/actas/requests/getMyActa/:id", controller.getMyActa);

    // -- Robot Sidea --
    app.get("/api/actas/requests/getOneTask/", controller.getRequestNoAttended);
    app.get("/api/actas/request/robots/1/getOne/", controller.getOneRobot1);
    app.get("/api/actas/request/robots/2/getOne/", controller.getOneRobot2);
    app.get("/api/actas/request/robots/3/getOne/", controller.getOneRobot3);

    app.put("/api/actas/requests/comment/:id", controller.commentsUp);
    app.post("/api/actas/robotUp/", uploaderActa.upload.single('acta'), controller.upPDF);
    app.get("/api/actas/requests/whomRequested/:id", controller.whomRequested);


    app.get("/api/actas/requests/myDates/", verifyAuth, session.verifySession, controller.getMyDates);
    app.get("/api/actas/requests/myRequests/:date", verifyAuth, session.verifySession, controller.getMyRequestesOnDate);


    app.post("/api/actas/requests/new/", auth.verify ,controller.newRequest);

}