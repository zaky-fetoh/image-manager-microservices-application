const {discover} = require("./service-discovery");
const axios = require("axios");



class advertiser{
    constructor(serviceName, password="1234"){
        this.serviceName = serviceName;
        this.password= password; 
        this.Jwtoken = null;
        this.RA_URI = null;
    }

    async authenticate(RA_URI){
        /*******************************
         * this method authenticate the services 
         * it sends a request to POST /srv-auth/srvName
         * then store JWToken to the attribute
         ***************/
        try{const ra_res = await axios.post(
                `${RA_URI}/srv-auth/${this.serviceName}`,{
                    password: this.password,
                });
            if(ra_res.data.ok){
                this.Jwtoken = ra_res.data.token
                return true;
            }else return null;
        }catch(e){
            console.error(e.message);
            return null}
    }
    
    async _register(RA_URI){
        /************
         * this method register the service to RA 
         */
        try{
        const ra_res = await axios.post(
            `${RA_URI}/service`,{
                name: this.serviceName,
                password: this.password,
            });
        return ra_res.data.ok? ra_res : null
        }catch(e){
            console.error(e.message);
            return null}
    }
    async _isRegisteredToRA(RA_URI){
        /**********
         * this method determine if the 
         */
         console.log(`Service Existance ${RA_URI}`)
         try{
            const ra_res = await axios.get(
                `${RA_URI}/service/${this.serviceName}`);
            console.log(`Service Existance ${ra_res}`)
            return ra_res.data.ok? ra_res.exist : null
        }catch(e){
            console.error(e.message);
            return null}
    }

    async registerService_and_authenticate(){
        /**********************
         * it initially dicover the RA from SR  
         * then methed register service iff not registerd and then authenticate
         **********/
        try{
        const RA_Addr = await discover("route-advertisement",
            "1.0.0");
            console.log(RA_Addr)
            this.RA_URI = `http://${RA_Addr.hostname}:${
                RA_Addr.port}`;
            if(await this._isRegisteredToRA(this.RA_URI)){
                await this.authenticate(this.RA_URI);
            }else{
                await this._register(this.RA_URI);
                await this.authenticate(this.RA_URI);
            }
        }catch(e){
            console.log(e.message);
        };
    }

    async advertise_route(route, method, version){
        /**********
         * this method advertise routes to RA
         */
        try{ const ra_res = (await axios.post(`${this.RA_URI
        }/route`,{route: route, method: method,
             service_version:version},{
                headers: {'Authorization':
                 `Baerer ${this.Jwtoken}`
            }})).data;
            return ra_res.ok
        }catch(e){
            console.log(e.message);
            return false;
        };
    }
}

module.exports = advertiser; 