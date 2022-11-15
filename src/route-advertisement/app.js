const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
mongoose.pluralize(null);
const morgan = require("morgan")

if (!process.env.ENV) require("dotenv").config();

const routeLogic = require("./controller/route");
const serviceLogic=require("./controller/service");

const DB_URI = process.env.MONGO_URI;
const SR_HOST = process.env.SER_REG_HOST;
const SR_PORT = process.env.SER_REG_PORT;

const VERSION = "1.0.0";

const registring = async(version, port)=>{
    try{
    const sr  = await axios.post(`http://${SR_HOST}:${SR_PORT
    }/service/route-advertisement/${version}/${port}`)
    if(!sr.data.ok) throw sr.message; 
    }catch(e){console.error(e)}
}


(async () => {
    try {
        console.log("connecting to DB")
        mongoose.connect(DB_URI);
        console.log("SUCCESFUllY C0NNECT")
    } catch (e) {
        console.log(`unable to Connect to Database ${DB_URI}`);
        console.log(`Exiting`);
        process.exit(1)
    };
    const app = express().use(morgan()).use(express.json())
        .post("/service", serviceLogic.addService)
        .post("/srv-auth", serviceLogic.authService)
        .delete("/service", serviceLogic.gard, serviceLogic.deleteService)
        
        .post("/route", serviceLogic.gard, routeLogic.addRoute)
        .delete("/route", serviceLogic.gard, routeLogic.deleteRoute)
        .get("route",routeLogic.getAllRoutes);

    const ser = app.listen(0, ()=>{
        const port = ser.address().port; 
        console.log(`SERVER is listening at ${port}`)
        new cron.CronJob("*/10 * * * * *",
        async( )=>{
            console.log("Service is regitred with to SR")
            registring(VERSION, port);
        },null,true)
    })
})();
