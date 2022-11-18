if (!process.env.ENV) require("dotenv").config();
const express = require('express');

const RUpdater = require("./controller/route_updater")

const PORT = process.env.PORT;


(async()=>{
    const app = express();
    const ser = app.listen(PORT,async()=>{
        const RU = new RUpdater(app);
        console.log(`GW is listen to ${PORT}`);
        const ro = await (RU.getAllInitialRoutes(app));
        app.use(ro);
    })
})()