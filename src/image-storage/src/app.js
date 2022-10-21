const express = require("express");
const morgan = require("morgan");
const path = require("path")
const fs = require("fs")

const imageSaver = require("./controller/saver");

const PORT = process.env.PORT || 3000

(async () => {
    express().use(morgan())
    .post("/upload", imageSaver,(req,res,next)=>{
        res.status(200).json({
            imageName: req.file.filename,
            ok: true,
        });
    })
    .get("download/:imageId",(req, res, next)=>{
        const imageId = req.params.imageId;
        const imagePath = path.join("..", "..","IMAGE_DB",imageId);
        if(fs.existsSync(imagePath)) return res.sendFile(imagePath);
        res.sendFile(404).json({
            error:"Image Does Not Exist",
        })
    })
    .listen(PORT,()=>{
        console.log(`Server Start listening at ${PORT}`)
    })
})()