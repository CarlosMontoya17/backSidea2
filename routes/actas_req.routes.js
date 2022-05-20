const controller = require("../controllers/actas_req.controller");
const verifyAuth = require("../middlewares/verifyAuth");

module.exports = function(app) {
    app.post("/api/actas/requests/createOne/", verifyAuth, controller.createARequest);
    app.get("/api/actas/requests/getOneTask/", controller.getRequestNoAttended);
    app.put("/api/actas/requests/comment/:id", controller.commentsUp);
    app.get("/api/actas/requests/obtainAll/", verifyAuth, controller.obtainAllRequets);
}