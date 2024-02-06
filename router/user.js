const userController=require("../controller/userController")
module.exports=(route,verifyToken)=>{
    route.post("/user/login",userController.userLogin);
    route.post("/user",userController.addUser);
    route.get("/alluser",verifyToken,userController.getAlluser);
    route.get("/user-detail",verifyToken,userController.getUserDetail);
    route.get("/user/:id",verifyToken,userController.getUserDetail);
    route.patch("/user/:id",verifyToken,userController.editUser);
    route.patch("/edit-user",verifyToken,userController.editUser);
    route.delete("/user/:id",verifyToken,userController.deleteUser);
    route.delete("/delete-user",verifyToken,userController.deleteUser);
    route.delete("/user/:id",verifyToken,userController.deleteUser);
    route.get("/admin/referal",verifyToken,userController.genrateLink);



}