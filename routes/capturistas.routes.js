const controller = require("../controllers/capturistas.controller");
const verifyAuth = require("../middlewares/verifyAuth");

module.exports = (app) => {
    app.post('/api/capturistas/register', controller.signUp);
    app.post('/api/capturistas/ingresar', controller.signIn);

}