const User = require("../database/model.js/user");
const UserDetail = require("../database/model.js/userDetail");
const Jwt=require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const bcrypt=require("bcrypt");
const helper=require("../helper/commonFuction")
const refferalCode=require("../database/model.js/refferalCode")
module.exports={
getAlluser:async(req,res,next)=>{
    let {role}=req.body
    console.log({role:req.body});
try{
if(role){
    if(role=="admin"){
       let AllUser=await User.aggregate([{"$lookup":{from:"userdetails",localField:"_id",foreignField:"userId",as:"userData"}},{"$unwind":"$userData"}])

//    let AllUser= await User.find({role:"user",status:1}).populate("userDetail");
   console.log({AllUser},"ryui");
   
   return res.send({status:200,data:AllUser})
    }
    else{
return res.status(400).send({status:400,message:"no user found"})
    }
}
else{
    return res.status(400).send({status:400,message:"no user found"})
        }
}
catch(err){
    return res.status(400).send({status:400,message:"something went wrong"})

}
},


getUserDetail:async(req,res,next)=>{
    let userId=req.params.id||req.body.id;
        console.log({userId, "----":"mmm"});
    try{
    let userDetail=await User.findOne({_id: userId});
    console.log({userDetail});
    if(userDetail){
    let users=await UserDetail.findOne({ userId});

    let userDetail=await User.findOne({_id: userId});
        return res.send({status:200,message:"success",data:{...userDetail._doc,...users._doc}})
    }
    else{
    return res.status(400).send({status:400,message:"no user found"})

    }
    }
    catch(err){
    return res.status(400).send({status:400,message:"something went wrong"})

    }
},


userLogin:async(req,res,next)=>{
    let {email,password}=req.body;
    // console.log({email,password});
try{
    if(!email){
        return res.status(400).send({status:400,message:"something went wrong"});
    }
    if(!password){
        return res.status(400).send({status:400,message:"something went wrong"});
    }
    let userData= await User.findOne({email});
    console.log({userData}, 63);
    if(userData){
        bcrypt.compare(password, userData.password, function(err, result) {
            if(err){
                return res.status(400).send({status:400,message:"something went wrong"})
            }
            if(result == true){
                let token=Jwt.sign(userData._id,process.env.secreteCode);
                if(token){
                    return res.send({status:200,message:"success",data:token, role: userData.role})
                }
            }
            else{
                return res.status(400).send({status:400,message:"something went wrong"})
            }
        });
        
    }
    else{
        return res.status(400).send({status:400,message:"something went wrong"})
    }

}
catch(err){
    return res.status(400).send({status:400,message:"something went wrong"})

}
},


addUser: async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).send({ status: 400, message: "Request body is missing" });
        }

        const { name, email, password, address, age, username, role } = req.body;
        if(!email){
            return res.send({status:400,message:"invalid email"});
        }
        else if(!password){
            return res.send({status:400,message:"invalid password"});
        }
        else if(!name){
            return res.send({status:400,message:"invalid name"});
        }
        else if(!username){
            return res.send({status:400,message:"invalid username"});
        } 
        if(req.body.refferByLink && req.body.code){
            if(helper.refferalCheck(refferalCode,req.body.code)){
                refferByLink=1
            }
        }
        let checkUser=await User.find({email});
        if(checkUser.length>0){
            return res.send({status:404,message:"user Already exist"});
        }
        console.log("object")

        // Create user
        let hash=await bcrypt.hash(password, 10);
        console.log({hash});
        let refferByLink;
        let userData = await User.create({
            _id:uuidv4(),
            name,
            username,
            email,
            password:hash,
            addedBy: role=="admin"? role : "user",
            refferByLink: refferByLink ? 1 : 0
        });

        if (!userData) {
            return res.status(400).send({ status: 400, message: "Failed to create user" });
        }

        // Create userDetail
        let userDoc = {_id:uuidv4(), userId: userData._id };

        if (age) userDoc.age = age

        if (address) userDoc.address = address

        userDoc.name = name;

        let userDetail = await UserDetail.create(userDoc);

        if (!userDetail) {
            return res.status(400).send({ status: 400, message: "Failed to create userDetail" });
        }

        // Generate and send token
        console.log({userDetail});
        let token = Jwt.sign(userData._id, process.env.secreteCode);

        if (!token) {
            return res.status(400).send({ status: 400, message: "Failed to generate token" });
        }

        return res.status(200).send({ status: 200, message: "Success", data: token });
    } catch (err) {
        console.error("Error:", err); 
        return res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
},

editUser:async(req,res,next)=>{
    let userId=req.params.id||req.body.id;
    console.log({userId},"00000000");
    let {name,age,address,updatedBy}=req.body;
try{
    let user={};
    if(age){
        user.age=age;
    }
    if(address){
        user.address=address;
    }
    if(name){
        user.name=name;
    }
    console.log(user,"---------");
    if(Object.keys(user).length){
        user.upadatingdate=new Date().valueOf();
        user.updatedBy=updatedBy?"admin":"user";
        console.log({user},"123456");
        let users=await UserDetail.updateOne({userId:userId},user);
        console.log({users});
        return res.send({status:200,message:"success"});
    }
    else{
        return res.send({status:400,message:"something went wrong"});
    }
    
}
catch(err){
    return res.status(400).send({status:400,message:"something went wrong"});
}
},
deleteUser:async(req,res,next)=>{
    let role=req.body.role;
    console.log({role,id:req.params.id});
    try{
        if(req.params.id && role=="admin"){
            await User.deleteOne({_id:req.params.id});
            await UserDetail.deleteOne({userDetail:req.params.id});


        }
        else{
            await User.delete({_id:req.body.id});
        }        
        return res.send({status:200,message:"success"});

        

    }
    catch(err){
        console.log({err});
        return res.send({status:400,message:"something went wrong"});

    }

},
genrateLink:async(req,res,next)=>{
    let {role}=req.body;
try{
    if(role=="admin"){
        let code=Math.floor(100000 + Math.random() * 900000);
        let createStatus=await refferalCode.create({code});
        if(createStatus){
            return res.send({status:200,message:"success",code})
        }
        else{
            return res.status(400).send({status:400,message:"somethig went wrong"});
        }
    }
    else{
        return res.status(400).send({status:400,message:"somethig went wrong"});

    }


}
catch(err){
    console.log({err});
    return res.status(400).send({status:400,message:"somethig went wrong",err});

}
},
}