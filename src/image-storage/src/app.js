const express = require("express");
const morgan = require("morgan");
if (!process.env.ENV) require("dotenv").config({path:"../"});

const SD = require("./controller/service-discovery");
const plainImageHandler = require("./controller/plain-image-hundler");
const cipherImageHundler = require("./controller/crypto-image-hundler");


const PORT = process.env.PORT || 0;
const VERSION="1.0.0";

(async () => {
    const app =express().use(morgan())
    
    .get("/plain-image/:imageId",plainImageHandler.downloadImage )
    .delete("/plain-image/:imageId", plainImageHandler.deleteImage)
    .post("/plain-image", plainImageHandler.uploadImage)
    
    .get("/cipher-image/:imageId",cipherImageHundler.downloadDecrImage)
    .delete("/cipher-image/:imageId", cipherImageHundler.deleteImage)
    .post("/cipher-image",cipherImageHundler.uploadEncrImage);

    const ser = app.listen(PORT,()=>{
        const port = ser.address().port;
        console.log(`Server Start listening at ${port}`)
        SD.periodicRegistering(VERSION,port);
    })
})()