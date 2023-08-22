const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas.js");
const campgrounds = require("../controllers/campgrounds.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const campgroundValidator = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", catchAsync(campgrounds.index));

router.get("/new", catchAsync(campgrounds.renderNewForm));

router.post("/", campgroundValidator, catchAsync(campgrounds.createCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get("/:id/edit", catchAsync(campgrounds.renderEditForm));

router.put(
  "/:id",
  campgroundValidator,
  catchAsync(campgrounds.updateCampground)
);

router.delete("/:id", catchAsync(campgrounds.deleteCampground));

module.exports = router;
