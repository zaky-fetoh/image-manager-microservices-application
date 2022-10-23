const multer = require("multer");
const uuidv4 = require("uuid").v4;
const express = require("express")
const path = require("path");
const fs = require("fs");

const IMAGE_DB = path.join(__dirname,"..","..","IMAGE_DB") ; 

//Multer Storage Spicicfication
const diskStroage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, IMAGE_DB)
    },
    filename: (req, file, callback) => {
        //Setting arandom unique Idfor the uploaded image
        const newFileName = uuidv4() + "." + file.mimetype.split("/")[1];
        console.log(`${file.originalname} is renamed with ${newFileName}`)
        callback(null, newFileName);
    },
});

exports.SaveSingleImage = multer({
    storage: diskStroage, //Save to storage spicified Above
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
exports.uploadImage = express.Router()
    .use(exports.SaveSingleImage,exports.ackWithFileName);


exports.downloadImage = (req, res, next)=>{
    const imageId = req.params.imageId;
    const imagePath = path.join(IMAGE_DB,imageId);
    if(fs.existsSync(imagePath)) return res.sendFile(imagePath);
    return res.status(404).json({
        error:"Image Does Not Exist",
    })
};