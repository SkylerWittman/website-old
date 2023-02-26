/**
 * Required External Modules
 */
import express from 'express';
import axios from 'axios';
import path from 'path';
import moment, { MomentInput }  from 'moment-timezone';

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || '8000';

/**
 *  App Configuration
 */

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'public')))
// Setting the express view variable to the directory containing all of the views.
app.set('views', path.join(__dirname, '..', 'public', 'views'));


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
    const latitude = 45.508888;
    const longitude = -73.561668;
    const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).toDateString();
    const baseUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

    const todayUrl = baseUrl;
    const yesterdayUrl = baseUrl + '&date=' + yesterday;

    const todayResponse = await getWeatherInfo(todayUrl);
    const yesterdayResponse = await getWeatherInfo(yesterdayUrl);

    const sunriseSunsetOutput = getSunriseSunsetOutput(todayResponse);
    const totalDaylightOutput = getTotalDaylightOutput(todayResponse);
    const daylightOutput = getDaylightOutput(todayResponse, yesterdayResponse);

    const daylightOutputResult = totalDaylightOutput + ' ' + daylightOutput;

    res.render('daylight.ejs', { sunrise_sunset_output: sunriseSunsetOutput, total_daylight_output: daylightOutputResult });
});

async function getWeatherInfo(url: string) {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data.results;
    } catch (error) {
        console.error(error);
    }
}

function getFormattedLocalizedDate(utcDate: MomentInput) {
    return moment(utcDate).tz('America/Toronto').format('h:mm:ss a');
}

function getSunriseSunsetOutput(todayResponse: any) {
    return `Today's sunrise was at ${getFormattedLocalizedDate(todayResponse.sunrise)} and the sunset was at ${getFormattedLocalizedDate(todayResponse.sunset)}`;
}

function getTotalDaylightOutput(todayResponse: any) {
    const todayDaylight = todayResponse.day_length
    const totalDaylightMoment = moment.duration(todayDaylight, 'seconds')
    return `\nWe enjoyed ${totalDaylightMoment.hours()} hours, ${totalDaylightMoment.minutes()} minutes and ${totalDaylightMoment.seconds()} seconds of total daylight.`;
}

function getDaylightOutput(todayResponse: any, yesterdayResponse: any) {
    const daylightDifference = todayResponse.day_length - yesterdayResponse.day_length;
    let additionalDaylightOutput = '';

    if (daylightDifference >= 0) { // more sunlight today than yesterday
        const moreDaylight = moment.duration(daylightDifference, 'seconds')
        if (moreDaylight.minutes() > 0) {
            additionalDaylightOutput += maybePlural(moreDaylight.minutes(), 'minute') + ' and ';
        }
        additionalDaylightOutput += moreDaylight.seconds() + ' seconds more';
    } else {
        const lessDaylight = moment.duration(-daylightDifference, 'seconds')
        if (lessDaylight.minutes() > 0) {
            additionalDaylightOutput += maybePlural(lessDaylight.minutes(), 'minute') + ' and ';
        }
        additionalDaylightOutput += lessDaylight.seconds() + ' seconds less';
    }

    return `That's <strong>${additionalDaylightOutput}</strong> than yesterday!`;
}

function maybePlural(value: number, word: string): string {
    return value > 1 ? `${value} ${word}s` : `${value} ${word}`;
}