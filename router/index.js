let verifyToken=require("../middleware/verifyToken")
module.exports=(express,app)=>{

    const user=express.Router();
    require("./user")(user,verifyToken)
    app.use("/",user)



}