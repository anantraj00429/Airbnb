const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post(
  "/",
  isLoggedIn,
  upload.single("listin[image]"),
  wrapAsync(listingController.createListing)
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

// Catch-all route
router.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/listing.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { isLoggedIn, isOwner } = require("../middleware.js");
// const { listingController } = require("../controllers/listings.js");

// //index Route
// const listingController = require("../controllers/listings.js") || {
//   index: (req, res) => res.send("Index placeholder"),
// };
// // Debug import result
// console.log(listingController);

// router.get("/", wrapAsync(listingController.index));

// //New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// //show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// //create Route
// router.post("/", isLoggedIn, wrapAsync(listingController.createListing));

// //Edit Route
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.renderEditForm)
// );

// //update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.updateListing)
// );

// //Delete Route
// router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

// router.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// console.log(listingController); // Should log the exported object
// console.log(isLoggedIn); // Should be a function

// module.exports = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };
