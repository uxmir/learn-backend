import multer from 'multer'

const storage=multer.diskStorage({
    
})
export const upload=multer({
    storage,
    limits:{fileSize:1024*1024*2},
        fileFilter:(req,file,cb)=>{
        const allowed=["image/png","image/jpeg","application/pdf"]
        if(allowed.includes(file.mimetype)){
            cb(null, true)
        }
        else{
            cb(new Error("file type is not supported"),false)
        }
    }
})