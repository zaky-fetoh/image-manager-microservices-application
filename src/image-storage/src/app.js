const express = require("express");
const morgan = require("morgan");


const plainImageHandler = require("./controller/plain-image-hundler");
const cipherImageHundler = require("./controller/crypto-image-hundler")

const PORT = process.env.PORT || 3000;

(async () => {
    express().use(morgan())
    
    .get("/plain-image/:imageId",plainImageHandler.downloadImage )
    .delete("/plain-image/:imageId", plainImageHandler.deleteImage)
    .post("/plain-image", plainImageHandler.uploadImage)
    
    .get("/cipher-image/:imageId",cipherImageHundler.downloadDecrImage)
    .delete("/cipher-image/:imageId", cipherImageHundler.deleteImage)
    .post("/cipher-image",cipherImageHundler.uploadEncrImage)

    .listen(PORT,()=>{
        console.log(`Server Start listening at ${PORT}`)
    })
})()