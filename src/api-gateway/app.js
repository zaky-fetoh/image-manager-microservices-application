if (!process.env.ENV) require("dotenv").config();
const express = require('express');
const cron = require("cron");
const RUpdater = require("./controller/route_updater")

const PORT = process.env.PORT;

let lastUpdateDate = 0


    (async () => {
        const app = express();
        const ser = app.listen(PORT, async () => {
            const RU = new RUpdater(app);
            console.log(`GW is listen to ${PORT}`);
            cron.CronJob("*/10 * * * * *", async () => {
                console.log(`Geting Routes gt ${new Date(lastUpdateDate)}`)
                const ro = await (RU.getAllInitialRoutes(lastUpdateDate));
                lastUpdateDate = ro[1];
                app.use(ro[0]);
                console.log(`routes updated upto ${new Date(lastUpdateDate)}`)
            },null, true);
        })
    })()