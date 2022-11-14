const http = require("http"); 
const url = require("url");

exports.forward = async(req, res,toEndPoint, method)=>{
    /************************
     * this method forword the incomming Request $req
     * to the $toEndPoint and it's response to the original
     * incomming response $res
     * INPUT: req, res object which is expected req, res
     * Express Objects. 
     * toEndPoint:string is the route for forwarding
     * to EndPoint is expectedto be of form of 
     * http://exampleHost:port/pah
     * $method parameter specifties HTTP verb to $toEndPoint
     ************************/
    const dstUrl = new url.URL(toEndPoint);
    req.pipe(http.request({
        method: method, 
        hostname: dstUrl.hostname, 
        port: dstUrl.port,
        path:dstUrl.path, 
        headers: req.headers,
    }, dres => {
        res.writeHeader(dres.statusCode, dres.headers)
        dres.pipe(res)
    }))
};