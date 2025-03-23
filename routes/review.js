const express=require("express");
const router=express.Router({mergeParams:true});//When parent route has some parameters which are used in callbacks

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const wrapAsync=require("../utils/wrapAsync.js");

const ExpressError=require("../utils/ExpressError.js");

const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const {createReview, destroyReview}=require("../controllers/review.js");

//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview));

module.exports=router;