const controller = require("../controllers/rfc_req.controller");
const verifyAuth = require("../middlewares/verifyAuth");
const uploaderRFC = require("../middlewares/uploaderRFC");


module.exports = (app) => {
    app.post("/api/rfc/request/new/", verifyAuth, controller.createOne);
    app.get("/api/rfc/request/getOne/", controller.getOneTask);
    app.put("/api/rfc/request/comment/:id", controller.addComments);
    app.get("/api/rfc/request/getMyData/:id", verifyAuth ,controller.getMyData);

    app.post("/api/rfc/request/robotUp/", uploaderRFC.upload.single('rfc'), controller.upPdf);
    app.get("/api/rfc/request/getMyRequest/", verifyAuth, controller.getAllRequest);

}