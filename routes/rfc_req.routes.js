const controller = require("../controllers/rfc_req.controller");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderRFC = require("../middlewares/uploaderRFC");


module.exports = (app) => {
    app.post("/api/rfc/request/new/", verifyAuth, controller.createOne);

    app.get("/api/rfc/request/getOne/", controller.getOneTask);

    app.get("/api/rfc/request/robots/1/getOne/", controller.getOneTaskRobot1);
    app.get("/api/rfc/request/robots/2/getOne/", controller.getOneTaskRobot2);
    app.get("/api/rfc/request/robots/3/getOne/", controller.getOneTaskRobot3);

    app.get("/api/rfc/request/robots/4/getOne/", controller.getOneTaskRobot4);

    app.put("/api/rfc/request/comment/:id", controller.addComments);
    app.get("/api/rfc/request/getMyData/:id", controller.getMyData);

    app.post("/api/rfc/request/robotUp/", uploaderRFC.upload.single('rfc'), controller.upPdf);
    app.get("/api/rfc/request/getMyRequest/", verifyAuth, controller.getAllRequest);
    app.get("/api/rfc/request/donwload/:id", verifyAuth, controller.getMyRFC);


    app.get("/api/rfc/requests/myDates/", verifyAuth, controller.getMyDates);
    app.get("/api/rfc/requests/myRequests/:date", verifyAuth, controller.getMyRequestesOnDate);

}