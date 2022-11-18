if (!process.env.ENV) require("dotenv").config();
const express = require('express');
const cron = require("cron");
const RUpdater = require("./controller/route_updater")

const PORT = process.env.PORT;

let lastUpdateDate = 0;


(async () => {
    const app = express();
    const ser = app.listen(PORT, async () => {
        const RU = new RUpdater();
        console.log(`GW is listen to ${PORT}`);
        new cron.CronJob("*/10 * * * * *", async () => {
            console.log(`Geting Routes gt ${new Date(lastUpdateDate)}`)
            const ro = await (RU.getAllRoutesFrom(lastUpdateDate));
            if(ro){
            lastUpdateDate = ro[1];
            app.use(ro[0]);
            console.log(`routes updated upto ${new Date(lastUpdateDate)}`)
        }}, null, true);
    })
})()