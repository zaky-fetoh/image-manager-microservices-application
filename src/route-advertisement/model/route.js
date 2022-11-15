const mongoose = require("mongoose");


const routeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    service_name:{
        type: String,
        required:true,
    },
    service_version:{
        type: String,
        required:true,
    },
    method:{
        type: String, 
        validate:{
        validator:(v)=>["GET","POST", "PUT", "DELETE"].includes(v),
        message: p => `${p.value} must be GET, POST, PUT, DELETE`,
        },required: true,
    },
    route:{
        type:String, 
        required: true,
    }
});

routeSchema.pre("save", async(next)=>{
    const roDoc = await module.exports.findOne({
        method: this.method, route: this.route,
    });
    if(roDoc) throw new Error("this End Point exist across the entire MSA")
    next();
})


module.exports = mongoose.model("route", routeSchema);