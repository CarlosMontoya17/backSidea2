const controller = require('../controllers/actas_reg.controller');
const VerifyAuth = require('../middlewares/verifyAuth');
const uploaderDoc = require("../middlewares/uploaderDoc");

module.exports = (app) => {
    app.post("/api/actas/reg/load/", verifyAuth ,uploaderDoc.upload.single('doc'), controller.upPDF);

};