const multer = require("multer");
const uuidv4 = require("uuid").v4 ;
const path = require("path");

const IMAGE_DB = path.join(__dirname,"..", "..","IMAGE_DB") ; 

const diskStroage = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null,IMAGE_DB)
    },
    filename:(req,file,callback)=>{
        const newFileName = uuidv4() +"."+ file.mimetype.split("/")[1];
        console.log(`${file.originalname} is renamed with ${newFileName}`)
        callback(null, newFileName);
    },  
})

module.exports = multer({
    storage: diskStroage,
    fileFilter:(req,file,callback)=>{
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if(mimetype && extname) return callback(null,true)
        callback("Not Matched Type Should be an Image")
    }
}).single("image");