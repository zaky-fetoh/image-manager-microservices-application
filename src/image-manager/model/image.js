const mongoose = require("mongoose");


const ImageSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    image_id: { type: mongoose.Schema.Types.String, },
    owner: { type: mongoose.Schema.Types.ObjectId, },
    tags: { type: [String], },
    view_count: {
        type: mongoose.Schema.Types.Number,
        default: 0,
    },
    stored_incrypted:{
        type:mongoose.Schema.Types.Boolean, 
        default:false, 
    }
})

module.exports = mongoose.model('image', ImageSchema);