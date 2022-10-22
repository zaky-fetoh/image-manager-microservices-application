
const IMAGE_DB = path.join(__dirname,"..","..","IMAGE_DB") ; 

exports.downloadImage = (req, res, next)=>{
    const imageId = req.params.imageId;
    const imagePath = path.join(IMAGE_DB,imageId);
    if(fs.existsSync(imagePath)) return res.sendFile(imagePath);
    return res.status(404).json({
        error:"Image Does Not Exist",
    })
}