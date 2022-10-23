const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
mongoose.pluralize(null);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;


(async () => {
    try{await mongoose.connect(MONGO_URI);
    console.log(`successfully connected to database URI: ${MONGO_URI}`)
    }catch(e){console.log(`unable to Connect to  URI: ${MONGO_URI}`)}

    express().use(morgan())
    
    .listen(PORT,()=>{
    console.log(`SERVER is listening at ${PORT}`)
    })

})();