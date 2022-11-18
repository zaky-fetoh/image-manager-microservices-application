const http = require("http"); 
const url = require("url");
const waitPort = require("wait-port");

exports.forward = (req, res,toEndPoint, method)=>{
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

    console.log(`forwarding to ${dstUrl}`)

    console.log({method: method, 
        hostname: dstUrl.hostname, 
        port: dstUrl.port,
        path:dstUrl.pathname,
    });
    try{
    waitPort({host:dstUrl.hostname, port:Number(dstUrl.port)})
    req.pipe(http.request({
        method: method, 
        hostname: dstUrl.hostname, 
        port: dstUrl.port,
        path:dstUrl.pathname, 
        headers: req.headers,
    }, dres => {
        res.writeHeader(dres.statusCode, dres.headers)
        console.log(`startPiping`)
        dres.pipe(res)
    }))
    }catch(e){
        res.status(500).json({
            ok:false, message: e.message,
        });
    }
};