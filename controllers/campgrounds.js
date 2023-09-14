
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

//index all campground page
module.exports.index = async (req, res) => {
  const campground = await Campground.find({});
  res.render("campgrounds/index", { campground });
};

//new campground page get
module.exports.renderNewForm = async (req, res) => {
  res.render("campgrounds/new");
};

//new campground creating
module.exports.createCampground = async (req, res, next) => {
  //console.log(req.body);
  //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
  const c = new Campground(req.body.campground);
  c.images=req.files.map(f=>({url:f.path,filename:f.filename}))
  c.author = req.user._id;
  await c.save();
  //console.log(c)
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${c._id}`);
};

//getting/showing particular campground after clicking view button
module.exports.showCampground = async (req, res) => {
  //console.log(req.params);
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("author");
  //console.log(campground);
  if (!campground) {
    req.flash("error", "can't find the campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", { campground });
};

//rendering edit form in respect to id
module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "can't find the campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

//editing and updating form
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground,});
  const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
}
 
  //console.log(req.body);
  req.flash("success", "Successfully updated a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

//delete camp
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a new campground!");
  res.redirect("/campgrounds");
};
