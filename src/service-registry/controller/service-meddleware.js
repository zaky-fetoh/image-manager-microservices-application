const dbops = require("./service-database");

exports.addService = async (req, res, next) => {
    /****************************
     * this Method adds the Services
     * Route : POST /service/:name/:version/:port
     * return: {ok:Boolean, service_id}
     ******************************/
    const service = {}
    service.name = req.params.name;
    service.version = req.params.version;
    service.port = Number(req.params.port);
    const ip = req.connection.remoteAddress;
    service.hostname = ip.includes('::') ? `[${ip}]` : ip;
    const out = await dbops.addService(service);
    res.status(out.ok ? 200 : 500).json(out)
};


exports.deleteService = async (req, res, next) => {
    /****************************
     * this Method deletes the Services
     * Route : DELETE /service/:name/:version/:port
     * return: {ok:Boolean, service_id}
     ******************************/
    const service = {}
    service.name = req.params.name;
    service.version = req.params.version;
    service.port = Number(req.params.port);
    const ip = req.connection.remoteAddress;
    service.hostname = ip.includes('::') ? `[${ip}]` : ip;
    const out = await dbops.deleteService(service);
    res.status(out.ok ? 200 : 500).json(out);
};

exports.getService = async (req, res, next) => {
    /****************************
     * this Method gets the Services
     * Route : GET /service/:name/:version
     * return: {ok:Boolean, service_id}
     ******************************/
    const service = {};
    service.name = req.params.name;
    service.version = req.params.version;
    const retServ = await dbops.getService(service);
    if(retServ) return res.status(200).json({
        ok: true, hostname: retServ.hostname,
        port: retServ.port,
    });
    else res.status(500).json({
        ok: false, message: "Not Service Found", 
    });
};
