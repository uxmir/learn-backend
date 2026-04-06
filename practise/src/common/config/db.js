import mongoose from "mongoose";
import ApiError from "../utils/api-error";
const connectDB=async()=>{
   const conn=await mongoose.connect(process.env.MONGO_URI) 
   console.log(`database is connected ${conn.connection.host}`)
   if(!conn) throw ApiError.notFound(`database is not connected`)

}

export default connectDB