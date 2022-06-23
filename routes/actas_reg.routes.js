const controller = require('../controllers/actas_reg.controller');
const verifyAuth = require('../middlewares/verifyAuth');
const uploaderDoc = require("../middlewares/uploaderDoc");

module.exports = (app) => {
    app.post("/api/actas/reg/load/", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);
    app.post("/api/actas/reg/new/", verifyAuth, controller.newActaReg);
    app.put("/api/actas/reg/transpose/:id", verifyAuth, controller.TransposeReg);
    //Historial de Registros
    app.get("/api/actas/reg/getMyHistory/", verifyAuth, controller.getMyHistory);
    //Corte
    app.get("/api/actas/reg/Corte/Dates/", verifyAuth, controller.getDates);
    app.get("/api/actas/reg/Corte/Clients/:date", verifyAuth, controller.GetClientsOnDate);
    app.get("/api/actas/reg/Corte/:id/:date", verifyAuth, controller.getCorte)
};