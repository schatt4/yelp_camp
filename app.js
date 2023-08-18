const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");

const port = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("connection open");
  })
  .catch((err) => {
    consoole.log(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campground = await Campground.find({});
    res.render("campgrounds/index", { campground });
  })
);

app.get(
  "/campgrounds/new",
  catchAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

app.post(
  "/campgrounds",
  campgroundValidator,
  catchAsync(async (req, res, next) => {
    //console.log(req.body);
    //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const c = new Campground(req.body.campground);
    await c.save();
    res.redirect(`/campgrounds/${c._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    //console.log(req.params);
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("review");
    //console.log(campground);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  campgroundValidator,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    //console.log(req.body);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/reviews",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const rev = await new Review(req.body.review);
    const result = camp.review.push(rev);
    await rev.save();
    await camp.save();
    //onsole.log(camp);
    //res.send("ok");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.delete(
  "/campgrounds/:campid/reviews/:revid",
  catchAsync(async (req, res) => {
    const { campid, revid } = req.params;
    await Campground.findByIdAndUpdate(campid, { $pull: { review: revid } });
    await Review.findByIdAndDelete(revid);
    res.redirect(`/campgrounds/${campid}`);
  })
);

//Error handling middlewire
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 400));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Serving on port ${3000}`);
});
