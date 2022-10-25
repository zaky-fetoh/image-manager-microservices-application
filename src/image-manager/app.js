const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
// require("dotenv").config()
mongoose.pluralize(null);

const userLogic = require("./controller/user");
const imageLogic = require("./controller/image");


const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;


(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`successfully connected to database URI: ${MONGO_URI}`)
    } catch (e) { 
        console.log(`unable to Connect to  URI: ${MONGO_URI}`) 
        console.log(e.message)
    }

    express().use(morgan()).use(express.json())
        .post("/signin", userLogic.signin)
        .post("/user", userLogic.addUser)
        .get("/user", userLogic.gard, userLogic.getUser)
        .put("/user", userLogic.gard, userLogic.updateUser)
        .delete("/user", userLogic.gard, userLogic.deleteUser)
        
        .post("/image/:encrypt", userLogic.gard, imageLogic.addImage)
        .delete("/image/:imageId", userLogic.gard, imageLogic.deleteImage)
        
        .get("/view-image/:imageId", userLogic.gard, imageLogic.viewImage)

        .listen(PORT, () => {
            console.log(`SERVER is listening at ${PORT}`)
        })

})();