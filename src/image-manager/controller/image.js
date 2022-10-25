const express = require("express");
const http = require("http")
const url = require("url")

const imageModel = require("../model/image");

const IS_HOST = process.env.IMAGEDISK_HOST;
const IS_PORT = process.env.IMAGEDISK_PORT;


// "/image/:encrypt"
exports.addImage = async (req, res, next) => {
    const encrypt = req.params.encrypt==="true";
    const path = (encrypt? "/cipher": "/plain") + "-image";
    const user_id = req.user_id;

    const data = [];

    const imreq = http.request({
        host: IS_HOST, port: IS_PORT, path: path,
        method:"POST", headers: req.headers, 
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
                    image_id: im._id,
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

// /image/:imageId
exports.deleteImage = async(req, res, next)=>{
    const user_id = req.user_id; 
    const image_id= req.params.imageId;
    const imDoc = await imageModel.findOne({
        _id:image_id, owner: user_id,
    });

    if(!imDoc) return res.status(404).json({
        ok:false, message: "File not found",
    })

    const encrypt = imDoc.stored_incrypted === "true";
    const path = (encrypt? "/cipher": "/plain") +
                 "-image/"+imDoc.image_id;
    const data = []
    const imreq = http.request({
        host: IS_HOST, port: IS_PORT, path: path,
        method:"DELETE", headers: req.headers, 
    },dres=>{
        dres.on("data",chunk=>data.push(chunk))
        dres.on("error", err=>res.status(500).json({
            ok:false, message: err.message,
        }));
        dres.on("end",async()=>{
            const jdata = JSON.parse(Buffer.concat(data).toString());
            if(jdata.ok){
                const result = await imageModel.deleteOne({
                    _id:image_id, owner: user_id,
                });
                res.status(200).json({
                    ok:true, deletedCount: result.deletedCount,
                })
            }else{
                res.status(500).json({
                    ok:false, message: jdata.message,
                });
            }
        });
    }).end();
}