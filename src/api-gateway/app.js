if (!process.env.ENV) require("dotenv").config();
const express = require('express');

const RUpdater = require("./controller/route_updater")

const PORT = process.env.PORT;


(async()=>{
    const app = express()
    const ser = app.listen(PORT,async()=>{
        const RU = new RUpdater(app);
        RU.getAllInitialRoutes();
    })
})()