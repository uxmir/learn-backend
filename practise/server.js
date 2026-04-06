import app  from '../src/app'
import connectDB from './src/common/config/db'
const PORT=process.env.PORT|| 3000
const start=async()=>{
    await connectDB()
     app.listen((PORT)=>{
    console.log(`server is running on ${PORT}`)
    })
}

start.catch((error)=>{
    console.error(error)
    process.exit(1)
})