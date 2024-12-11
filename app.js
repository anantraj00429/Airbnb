if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer");
const Listing = require("./models/listing.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
// const { serialize } = require("v8");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public/")));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.use("/listings", reviews);
// app.use("/listings", listings);
// app.use("/", user);

app.use("/listings", listings);
app.use("/listings", reviews);
app.use("/", user);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});

// POST Review Route
// app.post(
//   "/listings/:id/reviews",
//   wrapAsync(async (req, res) => {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       throw new ExpressError("Listing Not Found!", 404);
//     }
//     const newReview = new Review(req.body.review);
//     newReview.au+

// r = req.user ? req.user._id : "Anonymous"; // Handle author

//     listing.reviews.push(newReview);
//     await newReview.save(); // Save the review
//     await listing.save(); // Save the listing
//     res.redirect(`/listings/${listing._id}`); // Fixed redirect
//   })
// );

// // DELETE Review Route
// app.delete(
//   "/listings/:id/reviews/:reviewId",
//   wrapAsync(async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`); // Fixed redirect
//   })
// );
