const express = require("express");
const morgan = require("morgan");


const plainImageHandler = require("./controller/plain-image-hundler");
const cipherImageHundler = require("./controller/crypto-image-hundler")

const PORT = process.env.PORT || 3000;

(async () => {
    express().use(morgan())
    
    .get("/download/:imageId",plainImageHandler.downloadImage )
    .post("/upload", plainImageHandler.uploadImage)
    
    .get("/decr-download/:imageId",cipherImageHundler.downloadDecrImage)
    .post("/encr-upload",cipherImageHundler.uploadEncrImage)

    .listen(PORT,()=>{
        console.log(`Server Start listening at ${PORT}`)
    })
})()