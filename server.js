const express=require("express")
const app = express();
const dotenv = require("dotenv")
const Port= process.env.Port || 4000;
const cors=require("cors")
const {connect} = require("./database/dbConfig")

connect()
dotenv.config()
app.use(cors())
app.use(express.json());

require("./router")(express,app)


app.listen(Port,(err)=>{
    if (err) throw err;
    console.log(`server is running ${Port}`)
}) 