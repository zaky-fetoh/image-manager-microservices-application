const routeModel = require("../model/route");



exports.addRoute = async (req, res, next) => {
    /***************************************
     * POST /route
     * this methodAddes route route collection;
     * itExpects a {service_version,
     * method, route} object
     * outUt: { ok: Boolean, Route_id:ObjectId}
     * requires Gard to getService Name
     ****************************************/
    req.body.service_name = req.service_name;
    try {const routDoc = await routeModel.create(req.body);
        res.status(200).json({
            ok: true, route_id: routDoc._id,
        })
        console.log(`Service ${req.service_name} pushed Route ${req.body.route} for ${req.body.method}`);
        //////////////POST processing is neededfor newly add
    } catch (e) {
        res.status(400).json({
            ok: false, message: e.message,
        })
    }
};

exports.deleteRoute = async (req, res, next) => {
    /*******************
     * Route DELETE /route
     * payload {method, route}, 
     * this method delte route from the Collection
     * outPut: {ok: Boolean, deletedCount:Num}
     * It Required Gard Route
     *********************/
    try{
        const dltCount = (await routeModel.deleteMany({
            service_name: req.service_name,
            method: req.body.method,
            route: req.body.route,
        })).deletedCount;
        console.log(`${req.service_name} dleted Route ${req.body.route} for ${req.body.method}`);
        res.status(200).json({
            ok: true, deletedCount: dltCount,
        })
    } catch (e){
        res.status(500).json({
            ok:false, message: e.message,
    })};
}


exports.getAllRoutes = async(req, res, next)=>{
    /****************
     * this MthodReturns all routes registred
     * this methodis expectedto be called by
     * GW, Route: GET /route
     * returns allRoutes
     * newly Started API GW should callthis method
     ****************/
    try{console.log("requesting allRoutes");
        const allRoutes = await routeModel.find({},{__v:0})
        res.status(200).json({
            ok:true, routes: allRoutes
    })}catch(e){
        res.status(500).json({
        ok:false, message: e.message, 
    })}
}

exports.getRecent = async(req, res,next)=>{
    /************************
     * Running API GW will preiodically Callthis 
     * end pint to be apdated with all ROuted.
     */
}
