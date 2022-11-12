const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    _id:{ type: mongoose.Schema.Types.ObjectId, 
        default: mongoose.Types.ObjectId,
    }, 
    service_name:{
        type: mongoose.Schema.Types.String,
        required: true, 
    },
    service_version:{
        type: mongoose.Schema.Types.String, 
        required: true, 
    },
    hostname:{ 
        type: mongoose.Schema.Types.String, 
        required: true, 
    }, 
    port:{
        type: mongoose.Schema.Types.Number, 
        required: true, 
    }
});

module.exports = new mongoose.model("service_registry", ServiceSchema); 