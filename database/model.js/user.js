const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const User = new mongoose.Schema({
    _id:{
        type:String,
        default: uuidv4()

    },
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true,
        default:1
    },
    role:{
        type:String,
        default:"user",
    },
    addedBy:{
        type:String,
        default:"user"
    },
    updatedBy:{
        type:String,
        default:"user"
    },
    refferByLink:{
        type:Number,
        default:0
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
    userData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userDetail"
    }],
    
})
module.exports=mongoose.model("user",User)