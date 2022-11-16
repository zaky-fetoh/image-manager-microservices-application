const {discover} = require("./service-discovery");
const axios = require("axios");

class advertiser{
    constructor(serviceName, password="1234"){
        this.serviceName = serviceName;
        this.password= password; 
        this.Jwtoken = null;
    }
    authoize()


}