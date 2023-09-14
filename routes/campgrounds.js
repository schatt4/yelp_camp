const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds.js");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  campgroundValidator,
  isAuthor,
} = require("../middleware.js");
const multer = require('multer')
const { storage } = require("../cloudinary/index.js")
const upload = multer({ storage })


router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

// router.post("/", upload.array('image'), (req, res) => {
//   console.log(req.body, req.files)
//   res.send("it worked")
// })

router.post("/", isLoggedIn, upload.array('image'),campgroundValidator, catchAsync(campgrounds.createCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array('image'),
  campgroundValidator,
  catchAsync(campgrounds.updateCampground)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
