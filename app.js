const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
//const { storeReturnTo } = require("./middleware");

const port = 3000;

const userRoute = require("./routes/users");
const campgroundRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews.js");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("connection open");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  httpOnly: true,
  secret: "kitykat",
  resave: false,
  saveUninitialized: false,
  expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  //console.log(req.session, req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:campid/reviews", reviewRoute);

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/fakeUser", async (req, res) => {
//   const user = await new User({ email: "suju@gmail.com", username: "Sri" });
//   const newUser = await User.register(user, "chicken");
//   res.send(newUser);
// });

//Error handling middlewire
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  console.log(err);
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Serving on port ${3000}`);
});
