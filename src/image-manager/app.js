const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
mongoose.pluralize(null);


const userLogic = require("./controller/user");
const imageLogic = require("./controller/image");

if(!process.env.ENV) require("dotenv").config()


const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 0;

const VERSION = "1.0.0";
const SERVICE_NAME = "image-manager"
const SERVICE_PASS = process.env.SER_PASS || "1234"

const Advertiser =require("./controller/route-advertise")
const advertiser = new Advertiser (
    SERVICE_NAME, SERVICE_PASS,
)


(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`successfully connected to database URI: ${MONGO_URI}`)
    } catch (e) { 
        console.log(`unable to Connect to  URI: ${MONGO_URI}`) 
        console.log(e.message);
        process.exit(1);
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

        const ser = app.listen(PORT, async() => {
            const port = ser.address().port;
            periodicRegistering(VERSION, port); 
            await advertiser.registerService_and_authenticate();
            //Dummy ForTest
            await advertiser.advertise_route("/user",
            "GET", VERSION)

        })

})();