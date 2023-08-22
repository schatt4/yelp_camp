const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const rev = await new Review(req.body.review);
  const result = camp.review.push(rev);
  await rev.save();
  await camp.save();
  //onsole.log(camp);
  //res.send("ok");
  req.flash("success", "Successfully added a new review!");
  res.redirect(`/campgrounds/${camp._id}`);
};
