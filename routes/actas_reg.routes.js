const controller = require('../controllers/actas_reg.controller');
const verifyAuth = require('../middlewares/verifyAuth');
const uploaderDoc = require("../middlewares/uploaderDoc");
const session = require("../middlewares/verifySession");

module.exports = (app) => {
    app.post("/api/actas/reg/load/", verifyAuth , session.verifySession, uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/reg/new/", verifyAuth, session.verifySession, controller.newActaReg);
    app.put("/api/actas/reg/transpose/:id", verifyAuth, session.verifySession, controller.TransposeReg);
    app.put("/api/actas/reg/transposeSelf/:id", verifyAuth, session.verifySession, controller.TransposeFromItself);
    //Historial de Registros
    app.get("/api/actas/reg/getMyHistory/:date", verifyAuth, session.verifySession, controller.getMyHistory);
    //Corte
    app.get("/api/actas/reg/Corte/Dates/", verifyAuth, session.verifySession, controller.getDates);
    app.get("/api/actas/reg/Corte/Clients/:date", verifyAuth, session.verifySession, controller.GetClientsOnDate);
    app.get("/api/actas/reg/Corte/:id/:date", verifyAuth,session.verifySession, controller.getCorte);
    //Historial General
    app.get("/api/actas/reg/History/:date", verifyAuth, session.verifySession, controller.getHistoryOnDate);
    app.delete("/api/actas/reg/Trash/delete/:id", verifyAuth, session.verifySession, controller.Delete);
    app.put("/api/actas/reg/ChangeDate/:id", verifyAuth, session.verifySession, controller.ChangeDate);
};