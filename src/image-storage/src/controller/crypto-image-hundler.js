const fs = require("fs");
const path = require("path");

const multer = require("multer");
const uuidv4 = require("uuid").v4;
const express = require("express");

const encrytDisk = require("./encryptDiskStorage");
const cipher = require("./cipher");


const ENCRDB = path.join(__dirname,"..","..","ENCR_IMAGE_DB");
console.log(`Encryption IMAGEDB is ${ENCRDB}`);

const cipherDiskStorage = encrytDisk({
    destination: (req, file, callback) => {
        callback(null, ENCRDB)
    },
    filename: (req, file, callback) => {
        //Setting arandom unique Idfor the uploaded image
        const newFileName = uuidv4() + "." + file.mimetype.split("/")[1];
        console.log(`${file.originalname} is renamed with ${newFileName}`)
        callback(null, newFileName);
    },
})

exports.SaveEncrSingleImage = multer({
    storage: cipherDiskStorage, //Save to storage spicified Above
    fileFilter: (req, file, callback) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimetype && extname) return callback(null, true)
        callback("Not Matched Type Should be an Image")
    }
}).single("image");

/** if image storedSuccessfully using multer
 * Server will response with the file nume*/
 exports.ackWithFileName = (req, res, next) => {
    res.status(200).json({
        imageName: req.file.filename,
        ok: true,
    });
};

/**Compact Hundler for uploading the image
 */// compling multer hundler and the response middlWare
exports.uploadEncrImage = express.Router()
    .use(exports.SaveEncrSingleImage,exports.ackWithFileName);


//Downloading the decryptedVersion

exports.downloadDecrImage = (req, res, next)=>{
    const imageId = req.params.imageId;
    const imagePath = path.join(ENCRDB,imageId); 
    if(!fs.existsSync(imagePath)) return res.status(404).json({
        ok: false, message:"File Not Exit", 
    });
    fs.readFile(imagePath+".iv",{encoding:"hex"},(err,iv)=>{
        if(err) return res.status(500).json({
            ok:false, message: err.message,
        });
        res.status(200);
        const imageStream = fs.createReadStream(imagePath);
        cipher.decrypt(imageStream, res,iv)
    });
}




exports.deleteImage = (req, res, next)=>{
    const imageId = req.params.imageId;
    const imagePath = path.join(ENCRDB,imageId); 

    fs.unlink(imagePath,err=>{
        if(err) return res.status(500).json({
            ok:false, message:err.message,
        });
        fs.unlink(imagePath+".iv",err=>{
            if(err) return res.status(500).json({
                ok:false, message:err.message,
            });
            res.status(200).json({
                ok:true, message:`image ${imageId} deleted`,
            });
        })
    })
};