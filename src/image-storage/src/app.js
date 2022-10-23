const express = require("express");
const morgan = require("morgan");


const plainImageHandler = require("./controller/plain-image-hundler");


const PORT = process.env.PORT || 3000;

(async () => {
    express().use(morgan())
    .post("/upload", plainImageHandler.uploadImage)
    .get("/download/:imageId",plainImageHandler.downloadImage )

    .listen(PORT,()=>{
        console.log(`Server Start listening at ${PORT}`)
    })
})()