const User = require("../models/user");

//register form page renders
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

//registers  users post req
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to yelp-camp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

//login form page renders get req
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

//passport is doing the real login staff here only rendering part to remember the last used page of user before login is added
module.exports.login = (req, res) => {
  req.flash("success", "welcome back");
  //console.log(res.locals.returnTo);
  const requestedUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(requestedUrl);
};

//logout page get req
module.exports.logout = (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};
