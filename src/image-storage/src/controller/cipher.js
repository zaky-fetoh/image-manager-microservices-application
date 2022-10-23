const crypto = require("crypto");


const KEY  = process.env.CIPHER_KEY || 'a8b0ac7df167b74f3d51e8e5ea9f668d09a8b33c2373426b9043bc28e95ee857';
const ALGO = 'aes-256-cbc';

exports.encrypt = (ReadStream, WriteStream)=>{
    const iv = crypto.randomBytes(16); 
    let cipher = crypto.createCipheriv(ALGO,
                        Buffer.from(KEY), iv);
    setImmediate(()=>{
        ReadStream.pipe(cipher).pipe(WriteStream)
    })
    return {iv}
}

exports.decrypt = (ReadStream, WriteStream, iv)=>{
    iv = Buffer.from(iv);
    let decipher = crypto.createDecipheriv(ALGO,
                        Buffer.from(KEY), iv);
    ReadStream.pipe(decipher).pipe(WriteStream);
}




