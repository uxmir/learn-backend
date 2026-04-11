import fs  from 'node:fs'
//write
fs.writeFileSync("test.txt","hello from sync fs",)
const data=fs.readFileSync("test.txt","utf-8")
console.log(data) 
// ek loiner nice arek line
fs.appendFileSync("test.txt","\n hello from append")

//folder creating
fs.mkdirSync("myFolder/innerFolder",{recursive:true})
//folderrer vitor folder korte recursive
//deleting file
fs.unlinkSync("test.txt")
//renaming file
fs.renameSync("test.txt","text.txt")
//coping file
fs.cpSync("text.txt","text1.txt")
//deleting folder
fs.rmSync("myFolder")
//all were syncronous

