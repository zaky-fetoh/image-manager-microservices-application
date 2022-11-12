const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
mongoose.pluralize(null);

const srmdl  =require("./controller/service-meddleware");

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/SerReg";
const PORT = process.env.PORT || 0 


(async () => {

    console.log("Connecting to Database");
    try {
        await mongoose.connect(DB_URI);
    } catch (e) {
        console.error("Unable to connect To DB");
        console.error(e.message);
    }

    const app = express();
    app.use(morgan())
    .use(express.json())
    .get("/service/:name/:version",srmdl.getService)
    .post("/service/:name/:version/:port", srmdl.addService)
    .delete("/service/:name/:version/:port",srmdl.deleteService);
    
    const ser = app.listen(PORT,()=>{
        console.log(`service registry starts listening at ${
            ser.address().port}`)
    })
})()
