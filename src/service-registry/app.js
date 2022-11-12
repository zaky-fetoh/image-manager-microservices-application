const express = require("express");
const mongoose = require("mongoose");
mongoose.pluralize(null);

(async () => {

    console.log("Connecting to Database");
    try {
        await mongoose.connect(process.env.DB_URI);
    } catch (e) {
        console.error("Unable to connect To DB");
        console.error(e.message);
    }

    express()



})()
