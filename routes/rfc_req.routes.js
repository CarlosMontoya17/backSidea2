const controller = require("../controllers/rfc_req.controller");
const verifyAuth = require("../middlewares/verifyAuth");


module.exports = (app) => {
    app.post("/api/rfc/request/new/", verifyAuth, controller.createOne);
    app.get("/api/rfc/request/getOne/", controller.getOneTask);

}