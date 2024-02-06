const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const User = new mongoose.Schema({
    code:{type:String,required:true},
    addedDate:{type:String,
    default: new Date().valueOf().toString()
}
})
module.exports=mongoose.model("referal",User)
