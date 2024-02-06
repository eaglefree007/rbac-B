// let User = require("../database/model.js/user");
// const jwt=require("jsonwebtoken")
// module.exports=async (req,res,next)=>{
//     try{
//         let token = req.headers.authorization;
//         console.log(token, 6)
//         if(token){
//             token=token.split(" ");
//             if(token.length>1){
//                 console.log({token});
//                 let tokenData=await jwt.verify(token[1],process.env.secreteCode);
//                 console.log({tokenData});
//                 if(tokenData){
//                     let datas=await User.findOne({_id:tokenData});
//                     req.body={...req.body,id:tokenData,...datas._doc}
//                     next()
//                 }
//                 else{
//                     return res.send({status:400,message:"invalid token"})
//                 }
//             }
//             else{
//                 return res.send({status:400,message:"invalid token"})

//             }
//         }
//         else{
//             return res.send({status:400,message:"invalid token"})

//         }
//     }
//     catch(err){
//         return res.send({status:400,message:"invalid token"})


//     }
// }

const User = require("../database/model.js/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        console.log(token, 6)
        if (token) {
            token = token.split(" ");
            if (token.length > 1) {
                console.log({ token });
                let tokenData = await jwt.verify(token[1], process.env.secreteCode);
                console.log({ tokenData });
                if (tokenData) {
                    // Use tokenData directly to find the user
                    let user = await User.findById(tokenData);
                    // console.log(user)
                    if (user) {
                        console.log({user},"-------");
                        req.body = {  id: tokenData, ...user._doc,...req.body };
                        next();
                    } else {
                        return res.status(404).send({ status: 404, message: "User not found" });
                    }
                } else {
                    return res.status(400).send({ status: 400, message: "Invalid token" });
                }
            } else {
                return res.status(400).send({ status: 400, message: "Invalid token" });
            }
        } else {
            return res.status(400).send({ status: 400, message: "Invalid token" });
        }
    } catch (err) {
        return res.status(400).send({ status: 400, message: "Invalid token" });
    }
};
