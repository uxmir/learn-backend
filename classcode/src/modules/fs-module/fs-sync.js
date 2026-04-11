import fs from "node:fs"

// 1. WRITE

fs.writeFileSync("test.txt" , "kya haal chal")

// 2. READ
// const data = fs.readFileSync("test.txt" , "utf-8")

// console.log(data)

// fs.appendFileSync("test.txt" , "\nHello from append")

// fs.mkdirSync("myFolder/innerFolder" , {recursive:true});

// fs.unlinkSync("test.txt")

// fs.renameSync("test.txt" , "test1.txt")


// fs.cpSync("test1.txt" , "finalTest.txt")

fs.rmdirSync("myFolder")