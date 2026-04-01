import mongoose from "mongoose";
const connectBD=async()=>{
try {
    const conn=   await mongoose.connect(process.env.MONGO_URI)
 console.log(`MongoDB is Connected : ${conn.connection.host}`) 
} catch (error) {
console.error(` database is not connected ${error}`) 
}
}

export default connectBD