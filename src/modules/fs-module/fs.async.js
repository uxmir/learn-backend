import fs  from 'node:fs'
//write
fs.writeFile("test.txt","hello from sync fs",)
fs.readFile("test.txt","utf-8",(err,data)=>{
if(err)console.log(err)
console.log(data)
})
// ek loiner nice arek line
fs.appendFile("test.txt","\n hello from append")

//folder creating
fs.mkdir("myFolder/innerFolder",{recursive:true})
//folderrer vitor folder korte recursive
//deleting file
fs.unlink("test.txt")
//renaming file
fs.rename("test.txt","text.txt")
//coping file
fs.cp("text.txt","text1.txt")
//deleting folder 
fs.rm("myFolder")

