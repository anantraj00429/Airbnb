const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router.post(
  "/:id/reviews",
  isLoggedIn,
  wrapAsync(reviewController.createReview)
);

router.post("/", (req, res, next) => {
  console.log("Received POST request to /listings/:id/reviews");
  next();
});

//Delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

router.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

module.exports = router;

//  Reviews
// router.use(express.urlencoded({ extended: true })); // This allows parsing of form data

// router.post(
//   "/",
//   wrapAsync(async (req, res) => {

//     console.log(req.params.id);
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     await newReview.save(); // Save review to DB
//     listing.reviews.push(newReview); // Associate review with listing
//     await listing.save(); // Save listing with updated reviews

//     res.redirect(`/listings/${listing._id}`);
//   })
// );

// router.post(
//   "/",
//   wrapAsync(async (req, res) => {
//     console.log("Listing ID:", req.params.id);
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
//   })
// );
