const controller = require("../controllers/actas.controller");
const uploaderDoc = require("../middlewares/uploaderDoc");
const verifyAuth = require("../middlewares/verifyAuth");



module.exports = (app) => {
    app.post("/api/actas/load", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/up", verifyAuth ,controller.loadActa);

    //app.get("/api/getMyCorte/:username", controller.getMyCorte);
    app.get("/api/getMyCorteId/:id", controller.getMyCorte);

    app.get("/api/actas/getMyDocuments/:id", controller.getMyDocumentsUploaded);
    app.get("/api/actas/CountForEnterprise/:id", controller.countMyActasEnterprise);
    app.get("/api/actas/CountForProvider/:id", controller.countMyActasProvider);
    app.get("/api/actas/ClientsActuals/", verifyAuth, controller.clientsCurrent);
    app.get("/api/actas/CorteForSomeone/:id", controller.getCorteForOne);

    app.get("/api/actas/getMyDateCuts/:id", controller.getMyDatesCuts);

    app.get("/api/actas/getCutByDate/:id/:date", controller.getCorteDate);

    app.get("/api/actas/getMyClientsLevel/:level", verifyAuth, controller.documentsLevel);


    app.get("/api/actas/lowerToCut/", verifyAuth, controller.lowerToCut)
    app.get("/api/actas/getDatesCut/:id", controller.historialDate)
    app.get("/api/actas/getCut/:id/:date", controller.getCorte);


    app.delete("/api/actas/deleteActa/:id", verifyAuth, controller.deleteActa);


};