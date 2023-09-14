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
      author: "64f9ede624710db899da9456",
      title: `${rand(descriptors)} ${rand(places)}`,
      location: cities[i].city,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
      images: {
        url: 'https://res.cloudinary.com/dzkk67hl1/image/upload/v1694441828/Yelpcamp/yggb2s7el0b3hwrv8bhw.jpg',
        filename: 'Yelpcamp/yggb2s7el0b3hwrv8bhw',
      }

    });
    await c.save();
    //console.log(cities[i].city);
    // console.log(`${rand(descriptors)} ${rand(places)}`);
  }
};

seedDB();
