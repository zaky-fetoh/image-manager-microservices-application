const routeModel = require("../model/route"); 

exports.addRoute = async(req, res, next)=>{
    /***************************************
     * this methodAddes route route collection;
     * itExpects a routeModel object
     * outUt: { ok: Boolean, Route_id:ObjectId}
     ****************************************/
    try{ const routDoc = routeModel.create(req.body);
        res.status(200).json({
            ok:true, route_id: routDoc._id,
        })
    }catch(e){
        res.stutus(400).json({
            ok:false, message: e.message,
    })}
};

exports.deleteRoute = async(req,res,next)=>{
    
}