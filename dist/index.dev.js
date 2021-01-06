"use strict";

/**
 * Required External Modules
 */
var express = require("express");

var axios = require('axios');

var path = require("path");

var moment = require('moment-timezone');
/**
 * App Variables
 */


var app = express();
var port = process.env.PORT || "8000";
/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express["static"](path.join(__dirname, "public")));
/**
 * Server Activation
 */

app.listen(port, function () {
  console.log("Listening to requests on http://localhost:".concat(port));
});
/**
 * Routes Definitions
 */

app.get("/", function (req, res) {
  res.render("main", {
    title: "Main Page"
  });
});
app.get("/contact", function (req, res) {
  res.render("contact", {
    title: "Contact"
  });
});
app.get("/daylight", function _callee(req, res) {
  var latitude, longitude, yesterday, baseUrl, todayUrl, yesterdayUrl, todayResponse, yesterdayResponse, sunriseSunsetOutput, totalDaylightOutput, daylightOutput, finalOutput;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          latitude = 45.508888;
          longitude = -73.561668;
          yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24).toISOString();
          baseUrl = 'https://api.sunrise-sunset.org/json?lat=' + latitude + '&lng=' + longitude + '&formatted=0';
          todayUrl = baseUrl;
          yesterdayUrl = baseUrl + '&date=' + yesterday;
          _context.next = 8;
          return regeneratorRuntime.awrap(getWeatherInfo(todayUrl));

        case 8:
          todayResponse = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(getWeatherInfo(yesterdayUrl));

        case 11:
          yesterdayResponse = _context.sent;
          sunriseSunsetOutput = getSunriseSunsetOutput(todayResponse);
          totalDaylightOutput = getTotalDaylightOutput(todayResponse);
          daylightOutput = getDaylightOutput(todayResponse, yesterdayResponse);
          finalOutput = sunriseSunsetOutput + ' ' + totalDaylightOutput + ' ' + daylightOutput + ' Love you 💛';
          res.render("daylight", {
            title: "Hi Jess :)",
            output: finalOutput
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
});

function getWeatherInfo(url) {
  var response, data;
  return regeneratorRuntime.async(function getWeatherInfo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(axios.get(url));

        case 3:
          response = _context2.sent;
          data = response.data;
          return _context2.abrupt("return", data.results);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function getFormattedLocalizedDate(utcDate) {
  return moment(utcDate).tz("America/Toronto").format("h:mm:ss a");
}

function getSunriseSunsetOutput(todayResponse) {
  return 'Today\'s sunrise was at ' + getFormattedLocalizedDate(todayResponse.sunrise) + ' and the sunset was at ' + getFormattedLocalizedDate(todayResponse.sunset) + '.';
}

function getTotalDaylightOutput(todayResponse) {
  var todayDaylight = todayResponse.day_length;
  var totalDaylightMoment = moment.duration(todayDaylight, 'seconds');
  return 'We enjoyed ' + totalDaylightMoment.hours() + ' hours, ' + totalDaylightMoment.minutes() + ' minutes and ' + totalDaylightMoment.seconds() + ' seconds of total daylight.';
}

function getDaylightOutput(todayResponse, yesterdayResponse) {
  var daylightDifference = todayResponse.day_length - yesterdayResponse.day_length;
  var additionalDaylightOutput = '';

  if (daylightDifference >= 0) {
    // more sunlight today than yesterday
    var moreDaylight = moment.duration(daylightDifference, 'seconds');

    if (moreDaylight.minutes() > 0) {
      additionalDaylightOutput += maybePlural(moreDaylight.minutes(), 'minute') + ' and ';
    }

    additionalDaylightOutput += moreDaylight.seconds() + ' seconds more than yesterday!';
  } else {
    var lessDaylight = moment.duration(-daylightDifference, 'seconds');

    if (lessDaylight.minutes() > 0) {
      additionalDaylightOutput += maybePlural(lessDaylight.minutes(), 'minute') + ' and ';
    }

    additionalDaylightOutput += lessDaylight.seconds() + ' seconds less than yesterday!';
  }

  return additionalDaylightOutput;
}

function maybePlural(value, word) {
  if (value > 1) {
    return value + ' ' + word + 's';
  } else {
    return value + ' ' + word;
  }
}