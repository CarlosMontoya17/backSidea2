const controller = require('../controllers/actas_reg.controller');
const verifyAuth = require('../middlewares/verifyAuth');
const uploaderDoc = require("../middlewares/uploaderDoc");

module.exports = (app) => {
    app.post("/api/actas/reg/load/", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/reg/new/", verifyAuth, controller.newActaReg);
    app.put("/api/actas/reg/transpose/:id", verifyAuth, controller.TransposeReg);
    app.put("/api/actas/reg/transposeSelf/:id", verifyAuth, controller.TransposeFromItself);
    //Historial de Registros
    app.get("/api/actas/reg/getMyHistory/:date", verifyAuth, controller.getMyHistory);
    //Corte
    app.get("/api/actas/reg/Corte/Dates/", verifyAuth, controller.getDates);
    app.get("/api/actas/reg/Corte/Clients/:date", verifyAuth, controller.GetClientsOnDate);
    app.get("/api/actas/reg/Corte/:id/:date", verifyAuth, controller.getCorte)
    //Historial General
    app.get("/api/actas/reg/History/:date", verifyAuth, controller.getHistoryOnDate);
    app.delete("/api/actas/reg/Trash/delete/:id", verifyAuth, controller.Delete);
    app.put("/api/actas/reg/ChangeDate/:id", verifyAuth, controller.ChangeDate);
};