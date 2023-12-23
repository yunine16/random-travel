var express = require("express");
var router = express.Router();
require("dotenv").config();
const { Client } = require("@googlemaps/google-maps-services-js");

let place = "";

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(place);
  console.log("hello");
  res.render("index", { place: place });
});

router.get("/api/place", function (req, res, next) {
  const randomLatitude = Math.floor(Math.random() * 2500) / 1000 + 35;
  const randomLongitude = Math.floor(Math.random() * 5000) / 1000 + 135;
  const client = new Client();

  client
    .geocode({
      params: {
        key: process.env.API_KEY,
        latlng: `${randomLatitude},${randomLongitude}`,
        language: "ja",
      },
      timeout: 1000,
    })
    .then((r) => {
      const data = r.data.results[0].address_components;
      const placeName = () => {
        if (data.length < 2) {
          return "近くの海";
        }
        let text = "";
        for (let i = 1; i < data.length - 1; i++) {
          text = data[i].long_name == "日本" ? text : data[i].long_name + text;
        }
        return text;
      };
      place = placeName();
      res.redirect("/");
    })
    .catch((e) => {
      res.status(500);
      res.render("error", { error: e.response.data.error_message });
    });
});

module.exports = router;
