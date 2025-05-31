if(process.env.NODE_ENV !== "production") {
  // this will check if the environment is not production
  // if it is not production then it will load the environment variables from the .env file
  // this will be used to store the environment variables in the process.env object
require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({}); // first delete whole previously inserted data
    initData.data = initData.data.map((obj)=>({...obj, owner : "683a0f6d6bc8de6be6e8a313" }));
    await Listing.insertMany(initData.data); // then insert new data...
    console.log("data was initialized");
  };
  
initDB();