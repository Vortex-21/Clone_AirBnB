const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
        console.log("Connection Successful!");
    })
    .catch((err)=>{
        console.log("ERROR: ============>",err);
    })

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>{
        return {...obj,owner:'65e2a71fec72e2225ee00fb3'};
    });
    await Listing.insertMany(initData.data);
    console.log("DataBase Initialised.");
}

initDB();