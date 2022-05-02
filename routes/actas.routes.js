const controller = require("../controllers/actas.controller");
const uploaderDoc = require("../middlewares/uploaderDoc");
const verifyAuth = require("../middlewares/verifyAuth");



module.exports = (app) => {
    app.post("/api/actas/load", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/up", verifyAuth ,controller.loadActa);
    app.get("/api/getMyCorte/:username", controller.getMyCorte);
    app.get("/api/getMyDates/", verifyAuth, controller.getMyDates);
};