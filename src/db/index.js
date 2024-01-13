import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// import dotenv from "dotenv"

// dotenv.config({
//     path:'./env'
// });

const connectDB = async () => {
try{
const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
console.log(`\n MondoDB connected !! ${connectionInstance.connection.host}`)
}
catch(err)
{
    console.log(err);
}
}

export default connectDB;