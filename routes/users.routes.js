const controller = require("../controllers/users.controller");

module.exports = (app) => {
    app.post("/api/user/createOne/", controller.create);

    app.get("/api/user/getFull/", controller.getAll);
    
    app.get("/api/user/getOne/:id", controller.getOne);
    
    app.delete("/api/user/delete/:id", controller.deleteUser);
    
    app.put("/api/user/updateId/:id", controller.updatedUser);
    
    app.post("/api/user/signin/", controller.signIn);
    
}
