async function refferalCheck (db,code){
try{
let checkCode=await db.findOne({code});
if(checkCode){
   let del= await db.delete({code});
   if(del){
    return true
   }
}
else{
    return false;
}
}
catch(err){
    return false;

}
}

module.exports={refferalCheck}