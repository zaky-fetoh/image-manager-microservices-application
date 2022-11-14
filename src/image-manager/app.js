const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
mongoose.pluralize(null);

const cron = require("cron"); 
const axios= require("axios");

const userLogic = require("./controller/user");
const imageLogic = require("./controller/image");

if(!process.env.ENV) require("dotenv").config()


const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 0;

const SER_REG_HOST = process.env.SER_REG_HOST;
const SER_REG_PORT = process.env.SER_REG_PORT;



const registring = async(version, port)=>{
    try{
    const sr  = await axios.post(`http://${SER_REG_HOST}:${SER_REG_PORT
    }/service/image-manager/${version}/${port}`)
    if(!sr.data.ok) throw sr.message; 
    }catch(e){
        console.error(e);
    }
}


(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`successfully connected to database URI: ${MONGO_URI}`)
    } catch (e) { 
        console.log(`unable to Connect to  URI: ${MONGO_URI}`) 
        console.log(e.message)
    }

    const app =express().use(morgan()).use(express.json());
        app.post("/signin", userLogic.signin)
        .post("/user", userLogic.addUser)
        .get("/user", userLogic.gard, userLogic.getUser)
        .put("/user", userLogic.gard, userLogic.updateUser)
        .delete("/user", userLogic.gard, userLogic.deleteUser)
        
        .post("/image/:encrypt", userLogic.gard, imageLogic.addImage)
        .delete("/image/:imageId", userLogic.gard, imageLogic.deleteImage)
        
        .get("/view-image/:imageId", userLogic.gard, imageLogic.viewImage)

        const ser = app.listen(PORT, () => {
            const port = ser.address().port; 
            console.log(`SERVER is listening at ${port}`)
            new cron.CronJob("*/10 * * * * *",
            async( )=>{
                console.log("Service is regitred with to SR")
                registring("1.0.0", port);
            },null,true)

        })

})();