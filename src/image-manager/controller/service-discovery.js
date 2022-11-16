const axios = require("axios");
const cron = require("cron"); 


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
    try{
        const target = (await axios.get(`${SD_URI}/${
            srvName}/${srvVersion}`)).data
        return target.ok ? target: null
    }catch(e){
        console.error(e.message)
        return null 
    }
}


exports.registring = async(version, port)=>{
    /*************
     * When server start listing it will register it's
     * data to {port, version} to service registry
     ****************/

    try{
    const sr  = await axios.post(`http://${SER_REG_HOST}:${SER_REG_PORT
    }/service/image-manager/${version}/${port}`)
    if(!sr.data.ok) throw sr.message; 
    }catch(e){
        console.error(e);
    }
}

exports.periodicRegistering = async(version, port)=>{
    console.log(`SERVER is listening at ${port}`)
    new cron.CronJob("*/10 * * * * *",async( )=>{
        console.log("Service is regitred with to SR")
        exports.registring(version, port);
    },null,true)
}