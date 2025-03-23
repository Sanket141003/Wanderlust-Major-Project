const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({ //passport local mongoose automatically defines username & password ,we don't need to define them
    email:{
        type:String,
        required:true
    }
});
 
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User;
