const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const camp = await Campground.findById(req.params.campid);
  const rev = await new Review(req.body.review);
  rev.author = req.user._id;
  const result = camp.review.push(rev);
  await rev.save();
  await camp.save();
  //onsole.log(camp);
  //res.send("ok");
  req.flash("success", "Successfully added a new review!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { campid, revid } = req.params;
  await Campground.findByIdAndUpdate(campid, { $pull: { review: revid } });
  await Review.findByIdAndDelete(revid);
  req.flash("success", "Successfully deleted a new review!");
  res.redirect(`/campgrounds/${campid}`);
};
