const express=require("express");
const router=express.Router();

const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const {index,renderNewForm,showListing,createListing,renderEditForm,updateListing, destroyListing}=require("../controllers/listing.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


router.route("/listings")
.get(wrapAsync(index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(createListing));

//new route
router.get("/listings/new",isLoggedIn,wrapAsync(renderNewForm));

router.route("/listings/:id")
.get(wrapAsync(showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing));



//edit route
router.get("/listings/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));



module.exports=router;