const controller = require("../controllers/actas.controller");
const uploaderDoc = require("../middlewares/uploaderDoc");



module.exports = (app) => {
    app.post("/api/actas/load", uploaderDoc.upload.single('doc'), controller.upPDF);


};