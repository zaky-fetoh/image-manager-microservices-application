const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
    _id:{type: mongoose.Schema.Types.ObjectId,
          default: mongoose.Types.ObjectId },
    name:{type: String, required: true, unique: true}, 
    password:{type:String, required:true}, 
})
module.exports = mongoose.model("service", serviceSchema);