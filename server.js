 import "dotenv/config"
  import connectBD from "./src/common/config/db.js"
 import app from './src/app.js'
const PORT =process.env.PORT || 5000

 const start=async()=>{
await connectBD()
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT} in ${process.env.NODE_ENV}`)
    })
 }
 
start().catch(err=>{
    console.error(`failed to start server and this error ${err}`)
    process.exit(1)
})