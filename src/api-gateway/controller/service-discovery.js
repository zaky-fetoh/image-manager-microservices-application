const axios = require("axios");
const cron = require("cron"); 
const waitPort = require('wait-port');

const SER_REG_HOST = process.env.SER_REG_HOST;
const SER_REG_PORT = process.env.SER_REG_PORT;

const SD_URI = `http://${SER_REG_HOST}:${SER_REG_PORT}/service`

exports.discover = async(srvName, srvVersion)=>{
    /*****************
     * this method requesting the service registry
     * to findthe hostname, port of $srvName with a
     * specific Version of $srvVersion
     * INP: srvName: service name, srvVersion
     * RET: null if notExist || {hostname, Port}
     *********/
    try{console.log("waiting for SR/SD")
        await waitPort({host:SER_REG_HOST, port:Number(SER_REG_PORT)});
        const target = (await axios.get(`${SD_URI}/${
            srvName}/${srvVersion}`)).data
        console.log( `Service found ${target}`)
        return target.ok ? target: null;
    }catch(e){
        console.error(e.message)
        return null 
    }
}