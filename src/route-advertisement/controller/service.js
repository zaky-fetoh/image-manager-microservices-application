const serviceModel = require("../model/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my strong Sect";

exports.addService = async (req, res, next) => {
    /*******************
     * ROUTE: POST /service
     * this method expects a service object {name, password}
     * name mustbe unique.
     * then hash the password useing bcrypt, insert it to the 
     * DataBae and respond with service_id.
     ***********/
    try{const serv = req.body;
        serv.password = await bcrypt.hash(serv.password,12);
        const servDoc = serviceModel.create(serv);
        res.status(200).json({
        ok: true, service_id: servDoc._id,
        });
    }catch(e){
        res.status(200).json({
        ok: false, message: e.message,
    })}
};

exports.authService = async(req, res, next)=>{
    /*****************
     * Route: POST /service/:srvName
     * payload: {password:String},
     * this methodAuthinticate the 
     * service and return a jwtoken
     *****************/
    try{const srvName = req.params.srvName;
        const inPass = req.body.password;
        const stPass = (await serviceModel.findOne({
            name: srvName,
        },{__v:0})).password; 
        const match = await bcrypt.compare(inPass, stPass);
        if(match) jwt.sign({service_name: srvName},
            JWT_SECRET, (err, token)=>{
            if(err) return res.status(500).json({
                ok:false, message:err.message});
            res.status(200).json({
                ok: true, token,
            });
        });
    }catch(e){
        res.status(400).json({
            ok:false, message: "Service or passwordis wrong",
    })};
}

