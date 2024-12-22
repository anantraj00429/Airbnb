const mongoose = require("mongoose");
let initData = require("./data.js"); // Use `let` instead of `const`
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData = initData.data.map((obj) => ({
    ...obj,
    owner: "67545b76bc2c45f83c23578f",
  }));
  await Listing.insertMany(initData); // Use initData directly
  console.log("data was saved");
};

initDB();
