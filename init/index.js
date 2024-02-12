const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
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
    await Listing.insertMany(initData.data);
    console.log("DataBase Initialised.");
}

initDB();