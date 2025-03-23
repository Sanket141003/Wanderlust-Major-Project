const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


main()
.then(()=>{
    console.log("Connection Sucessful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

}   

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=> ({...obj,owner:'67b2e5ae28e6d9ab3bff4a98'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
  
initDB();
  