if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

//express setup
const express=require("express");
const app=express();
const port=8080;

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})
  
//ejs setup
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//To set boilerplate on all pages
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

//mongoose setup
const mongoose=require("mongoose");

//const MONGO_URL='mongodb://127.0.0.1:27017/wonderlust';
const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Connection Sucessful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}  

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const methodOverride=require("method-override");
app.use(methodOverride("_method")); 

const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');

const store=MongoStore.create({       
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{ 
    console.log("Error in Mongo Session Store",err);
});


const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//Date.now() returns current time in milliseconds 
        maxAge:7*24*60*60*1000,
        httpOnly:true 
    },
}

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//home route 
// app.get("/",(req,res)=>{
//     res.send("Hi,I am root"); 
// }) 
 
const flash=require("connect-flash");
app.use(flash());
 
app.use((req,res,next)=>{ 
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;   
    //console.log( res.locals.success);
    next(); 
}) 
 
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })

//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

//listings routes
app.use("/",listingRouter);
  

//Reviews routes
app.use("/listings/:id/reviews",reviewRouter);

//User routes
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//Error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Something Went wrong!"}=err;
    res.status(status).render("error.ejs",{err});
    //res.status(status).send(message);
});