"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Required External Modules
 */
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/**
 * App Variables
 */
const app = (0, express_1.default)();
const port = process.env.PORT || '8000';
/**
 *  App Configuration
 */
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.set('views', path_1.default.join(__dirname, '..', 'public', 'views'));
/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
    res.render('index.ejs');
});
app.get('/contact', (req, res) => {
    res.render('contact.ejs');
});
// TODO this is glitched, the seconds of daylight more than yesterday is doubled, 
// also get changes from the spotify branc
app.get('/daylight', async (req, res) => {
    var latitude = 45.508888;
    var longitude = -73.561668;
    var yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).toDateString();
    var baseUrl = 'https://api.sunrise-sunset.org/json?lat=' + latitude + '&lng=' + longitude + '&formatted=0';
    const todayUrl = baseUrl;
    const yesterdayUrl = baseUrl + '&date=' + yesterday;
    var todayResponse = await getWeatherInfo(todayUrl);
    var yesterdayResponse = await getWeatherInfo(yesterdayUrl);
    var sunriseSunsetOutput = getSunriseSunsetOutput(todayResponse);
    var totalDaylightOutput = getTotalDaylightOutput(todayResponse);
    var daylightOutput = getDaylightOutput(todayResponse, yesterdayResponse);
    var daylightOutputResult = totalDaylightOutput + ' ' + daylightOutput;
    res.render('daylight.ejs', { sunrise_sunset_output: sunriseSunsetOutput, total_daylight_output: daylightOutputResult });
});
async function getWeatherInfo(url) {
    try {
        const response = await axios_1.default.get(url);
        const data = response.data;
        return data.results;
    }
    catch (error) {
        console.error(error);
    }
}
function getFormattedLocalizedDate(utcDate) {
    return (0, moment_timezone_1.default)(utcDate).tz('America/Toronto').format('h:mm:ss a');
}
function getSunriseSunsetOutput(todayResponse) {
    return 'Today\'s sunrise was at ' + getFormattedLocalizedDate(todayResponse.sunrise) + ' and the sunset was at ' + getFormattedLocalizedDate(todayResponse.sunset) + '.';
}
function getTotalDaylightOutput(todayResponse) {
    var todayDaylight = todayResponse.day_length;
    var totalDaylightMoment = moment_timezone_1.default.duration(todayDaylight, 'seconds');
    return '\nWe enjoyed ' + totalDaylightMoment.hours() + ' hours, ' + totalDaylightMoment.minutes() + ' minutes and ' + totalDaylightMoment.seconds() + ' seconds of total daylight.';
}
function getDaylightOutput(todayResponse, yesterdayResponse) {
    var daylightDifference = todayResponse.day_length - yesterdayResponse.day_length;
    let additionalDaylightOutput = '';
    if (daylightDifference >= 0) { // more sunlight today than yesterday
        var moreDaylight = moment_timezone_1.default.duration(daylightDifference, 'seconds');
        if (moreDaylight.minutes() > 0) {
            additionalDaylightOutput += maybePlural(moreDaylight.minutes(), 'minute') + ' and ';
        }
        additionalDaylightOutput += moreDaylight.seconds() + ' seconds more';
    }
    else {
        var lessDaylight = moment_timezone_1.default.duration(-daylightDifference, 'seconds');
        if (lessDaylight.minutes() > 0) {
            additionalDaylightOutput += maybePlural(lessDaylight.minutes(), 'minute') + ' and ';
        }
        additionalDaylightOutput += lessDaylight.seconds() + ' seconds less';
    }
    return 'That\'s <strong>' + additionalDaylightOutput + '</strong> than yesterday!';
}
function maybePlural(value, word) {
    return value > 1 ? `${value} ${word}s` : `${value} ${word}`;
}