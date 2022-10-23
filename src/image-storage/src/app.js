const express = require("express");
const morgan = require("morgan");


const plainImageHandler = require("./controller/plain-image-hundler");


const PORT = process.env.PORT || 3000;

(async () => {
    express().use(morgan())
    .get("/download/:imageId",plainImageHandler.downloadImage )
    .post("/upload", plainImageHandler.uploadImage)
    .post("/form",express.urlencoded({extended: true}), (req,res,next)=>{
        console.log(req.body)
        res.send("end")
    })
    .listen(PORT,()=>{
        console.log(`Server Start listening at ${PORT}`)
    })
})()