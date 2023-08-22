const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Campground = require("../models/campground");
const reviews = require("../controllers/reviews");

const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post("/", validateReview, catchAsync(reviews.createReview));

router.delete(
  "/campgrounds/:campid/reviews/:revid",
  catchAsync(reviews.deleteReview)
);

module.exports = router;
