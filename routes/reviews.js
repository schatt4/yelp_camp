const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Campground = require("../models/campground");
const reviews = require("../controllers/reviews");

const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//deleteing reviews /campgrounds/:campid/reviews
router.delete(
  "/:revid",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
