const waitPort = require('wait-port');
const axios = require("axios");
const cron = require("cron");

const SD = require("./service-discovery");
const { forward } = require("./forworder");

class RouteUpdater {
    constructor(app) {
        this.app = app;
        this.RA_URI = null;
    }
    addRoute(routeInfo) {
        let hundler = null
        switch (routeInfo.method) {
            case "GET": hundler = this.app.get; break;
            case "POST": hundler = this.app.post; break;
            case "PUT": hundler = this.app.put; break;
            case "DELETE": hundler = this.app.delete; break;
        }
        hundler(routeInfo.route, async (req, res, next) => {
            const SRV_addr = await SD.discover(routeInfo.service_name,
                service_version);
            const SRV_URl = `http://${SRV_addr.hostname
                }:${SRV_addr.port}${routeInfo.route}`;
            forward(req, res, SRV_URl, routeInfo.method);
        })
    }
    async getAllInitialRoutes() {

        const RA_addr = await SD.discover("route-advertisement",
            "1.0.0");
        this.RA_URI = `http://${RA_addr.hostname
            }:${RA_addr.port}/route`;
        const allRoutes = (await axios.get(this.RA_URI)).routes;
        allRoutes.array.forEach(element => {
            this.addRoute(element);
        });
    }
}

module.exports = RouteUpdater; 