const controller = require("../controllers/users.controller");
const verifyAuth = require("../middlewares/verifyAuth");

module.exports = (app) => {
    app.post("/api/user/createOne/", controller.create);

    app.get("/api/user/getFull/", controller.getAll);
    
    app.get("/api/user/getOne/:id", controller.getOne);
    
    app.delete("/api/user/delete/:id", verifyAuth, controller.deleteUser);
    
    app.put("/api/user/updateId/:id", verifyAuth, controller.updatedUser);

    app.put("/api/user/updatePrice", controller.updatePrecios);

    app.get("/api/user/getMyClients/:id", controller.getMyClients);

    app.get("/api/clients/getAll", controller.getAllCibers);


    app.put("/api/clients/getMyData/:id", controller.getMyData);
    
    app.post("/api/user/signin/", controller.signIn);

    app.post("/api/hash/", controller.hasheo);
    
}
