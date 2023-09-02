const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds.js");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  campgroundValidator,
  isAuthor,
} = require("../middleware.js");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

router.post("/", campgroundValidator, catchAsync(campgrounds.createCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  "/:id",
  isAuthor,
  campgroundValidator,
  catchAsync(campgrounds.updateCampground)
);

router.delete("/:id", isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
