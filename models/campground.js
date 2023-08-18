const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  location: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await review.deleteMany({
      _id: { $in: doc.review },
    });
  }
});
module.exports = mongoose.model("Campground", CampgroundSchema);
