const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const UserDetail = new mongoose.Schema({
    _id:{
        type:String,
        default: uuidv4()
    },
    userId:{
        type:String,
        required:true
    },
    age:{
        type:String,
    },
    address:{
        type:String,
    },
    name:{
        type:String,
        required:true
    },
    addingdate:{
        type:String,
        required:true,
        default:new Date().valueOf()
    },
    upadatingdate:{
        type:String,
        required:true,
        default:new Date().valueOf()
    },
    role:{
        type:String,
        default:"user",
    },
})
module.exports=mongoose.model("userDetail", UserDetail)