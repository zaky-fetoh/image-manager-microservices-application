const express = require("express");
const http = require("http")
const url = require("url")

const imageModel = require("../model/image");

const IS_HOST = process.env.IMAGEDISK_HOST;
const IS_PORT = process.env.IMAGEDISK_PORT;

exports.addImage = async (req, res, next) => {
    const encrypt = Boolean(req.params.encrypt);
    const user_id = req.user_id;
    const path = encrypt? "/encr-upload": "/upload";

    const data = [];

    const imreq = http.request({
        host: IS_HOST, 
        port: IS_PORT, 
        path: path,
        method:"POST", 
        headers: req.headers, 
    }, imres=>{
        imres.on("data",chunk=> data.push(chunk)); 
        imres.on("error",console.error);
        imres.on("end",async()=>{
            const jdata = JSON.parse(Buffer.concat(data).toString());
            console.log(jdata);
            if(jdata.ok){
                const im = await imageModel.create({
                    image_id: jdata.imageName,
                    owner: user_id,
                    stored_incrypted:encrypt,
                }); 
                return res.status(200).json({
                    add_image_id: im._id,
                    ok: true, 
                })
            }else{
                return res.status(500).json({
                    ok: false,
                })
            }
        })
    })
    req.pipe(imreq);
};