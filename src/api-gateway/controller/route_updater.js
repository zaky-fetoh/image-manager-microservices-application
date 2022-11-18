const waitPort = require('wait-port');
const axios = require("axios");
const cron = require("cron");
const express = require("express");

const SD = require("./service-discovery");
const { forward } = require("./forworder");

class RouteUpdater {
    constructor() {
        this.RA_URI = null;
    }
    addRoutes(routesInfo) {
        const router = express.Router()
        routesInfo.forEach(routeInfo => {
            const midleware = async (req, res, next) => {
                try {
                    const SRV_addr = await SD.discover(routeInfo.service_name,
                        routeInfo.service_version);
                    if(!SRV_addr) throw new Error(`Service ${routeInfo.service_name
                            } of version ${ routeInfo.service_version
                            } Not Found`)
                    const SRV_URl = `http://${SRV_addr.hostname
                        }:${SRV_addr.port}${req.originalUrl}`;
                    forward(req, res, SRV_URl, routeInfo.method);
                }catch(e){
                    res.status(500).json({
                        message: e.message,
                        ok: false,
                    });
                }
            };
            console.log(`adding route ${routeInfo.route} method ${routeInfo.method
                } for service ${routeInfo.service_name}`)
            switch (routeInfo.method) {
                case "GET": router.get(routeInfo.route, midleware); break;
                case "POST": router.post(routeInfo.route, midleware); break;
                case "PUT": router.put(routeInfo.route, midleware); break;
                case "DELETE": router.delete(routeInfo.route, midleware); break;
            }
        })
        return router;
    }
    async getAllInitialRoutes() {
        const RA_addr = await SD.discover("route-advertisement",
            "1.0.0");
        this.RA_URI = `http://${RA_addr.hostname
            }:${RA_addr.port}/route`;
        await waitPort({host:RA_addr.hostname, port:Number(RA_addr.port)});
        const allRoutes = (await axios.get(this.RA_URI)).data.routes;
        return this.addRoutes(allRoutes)
    }
}

module.exports = RouteUpdater; 