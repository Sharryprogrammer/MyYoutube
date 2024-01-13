// require('dotenv').config({path: '/env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
dotenv.config({
    path:'./env'
})
connectDB()

















/*
import express from "express";

// mongoose.connect(MONGODB_URI)
const app = express();
(async () => {
try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("error in connections",error);
        throw error
    })

    app.listen(process.env.PORT,()=>{
        console.log(`listening on ${process.env.PORT}`)
    })
}
catch(err){
    console.log(err)
    throw err
}
})()
*/