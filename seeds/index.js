const mongoose = require("mongoose");
const Campground = require("../models/campground");

const cities = require("./cities");

const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("connection open");
  })
  .catch((err) => {
    console.log("connection error");
    console.log(err);
  });

const rand = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
  await Campground.deleteMany();
  for (let i = 0; i <= 10; i++) {
    const price = Math.floor(Math.random() * 10) + 40;
    const c = new Campground({
      author: "64f0b0228db2db9900b3f9e7",
      title: `${rand(descriptors)} ${rand(places)}`,
      location: cities[i].city,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
    });
    await c.save();
    //console.log(cities[i].city);
    // console.log(`${rand(descriptors)} ${rand(places)}`);
  }
};

seedDB();
