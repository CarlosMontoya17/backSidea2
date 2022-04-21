const controller = require("../controllers/users.controller");
const verifyAuth = require("../middlewares/verifyAuth");

module.exports = (app) => {
    app.post("/api/user/createOne/", verifyAuth, controller.create);

    app.get("/api/user/getFull/", controller.getAll);
    
    app.get("/api/user/getOne/:id", controller.getOne);
    
    app.delete("/api/user/delete/:id", verifyAuth, controller.deleteUser);
    
    app.put("/api/user/updateId/:id", verifyAuth, controller.updatedUser);
    
    app.post("/api/user/signin/", controller.signIn);
    
}
