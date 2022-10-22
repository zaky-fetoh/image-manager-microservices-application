const express = require("express");
const morgan = require("morgan");


const Saver = require("./controller/saver");
const Downloader = require("./controller/downloader")


const PORT = process.env.PORT || 3000;

(async () => {
    express().use(morgan())
    .post("/upload", Saver.uploadImage)
    .get("/download/:imageId",Downloader.downloadImage )

    .listen(PORT,()=>{
        console.log(`Server Start listening at ${PORT}`)
    })
})()