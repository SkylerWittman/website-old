/**
 * Required External Modules
 */
const express = require("express");
const axios = require('axios')
const path = require("path");
const moment = require('moment')

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.render("main", { title: "Main Page" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact" });
});


app.get("/daylight", async(req, res) => {
    var latitude = 45.508888
    var longitude = -73.561668
    var yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).toISOString()
    var baseUrl = 'https://api.sunrise-sunset.org/json?lat=' + latitude + '&lng=' + longitude + '&formatted=0'

    const todayUrl = baseUrl
    const yesterdayUrl = baseUrl + '&date=' + yesterday

    var todayResponse = await getWeatherInfo(todayUrl)
    var yesterdayResponse = await getWeatherInfo(yesterdayUrl)

    var sunriseSunsetOutput = getSunriseSunsetOutput(todayResponse)
    var totalDaylightOutput = getTotalDaylightOutput(todayResponse)

    var daylightOutput = getDaylightOutput(todayResponse, yesterdayResponse)

    var finalOutput = sunriseSunsetOutput + ' ' + totalDaylightOutput + ' ' + daylightOutput + ' Love you 💛'

    res.render("daylight", { title: "Hi Jess :)", output: finalOutput });
});

async function getWeatherInfo(url) {
    try {
        const response = await axios.get(url)
        const data = response.data
        return data.results
    } catch (error) {
        console.error(error)
    }
}

function getFormattedLocalizedDate(utcDate) {
    return moment(utcDate).format("h:mm:ss a")
}

function getSunriseSunsetOutput(todayResponse) {
    return 'Today\'s sunrise was at ' + getFormattedLocalizedDate(todayResponse.sunrise) + ' and the sunset was at ' + getFormattedLocalizedDate(todayResponse.sunset) + '.'
}

function getTotalDaylightOutput(todayResponse) {
    var todayDaylight = todayResponse.day_length
    var totalDaylightMoment = moment.duration(todayDaylight, 'seconds')
    return 'We enjoyed ' + totalDaylightMoment.hours() + ' hours, ' + totalDaylightMoment.minutes() + ' minutes and ' + totalDaylightMoment.seconds() + ' seconds of total daylight.'
}

function getDaylightOutput(todayResponse, yesterdayResponse) {
    var daylightDifference = todayResponse.day_length - yesterdayResponse.day_length
    let additionalDaylightOutput = ''

    if (daylightDifference >= 0) { // more sunlight today than yesterday
        var moreDaylight = moment.duration(daylightDifference, 'seconds')
        if (moreDaylight.minutes() > 0) {
            additionalDaylightOutput += maybePlural(moreDaylight.minutes(), 'minute') + ' and '
        }
        additionalDaylightOutput += moreDaylight.seconds() + ' seconds more than yesterday!'
    } else {
        var lessDaylight = moment.duration(-daylightDifference, 'seconds')
        if (lessDaylight.minutes() > 0) {
            additionalDaylightOutput += maybePlural(lessDaylight.minutes(), 'minute') + ' and '
        }
        additionalDaylightOutput += lessDaylight.seconds() + ' seconds less than yesterday!'
    }

    return additionalDaylightOutput
}

function maybePlural(value, word) {
    if (value > 1) {
        return value + ' ' + word + 's'
    } else {
        return value + ' ' + word
    }
}