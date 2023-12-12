const areas = require('../public/countries+states+cities.json');
const wmo_description = require('../public/wmo_description.json');
const { IPinfoWrapper } = require('node-ipinfo');

exports.home = async (req, res) => {
    const { country, region, city } = await getUserLocation(req) || { country: "CA", region: "Ontario", city: "Toronto" };
    res.redirect(`/weekly/${country}/${region}/${city}`)
}

exports.hourly = async (req, res) => {
    const { country, region, city } = req.params;
    const { latitude, longitude, stateCode } = getLocation(country, region, city);
    const currentWeather = await getCurrentWeather(latitude, longitude);
    const hourlyWeather = await getHourylyWeather(latitude, longitude);

    const data = {
        time: currentWeather["current"]["time"],
        latitude: latitude,
        longitude: longitude,
        country: country,
        region: region,
        city: city,
        stateCode: stateCode,
        timezone: currentWeather["timezone"],
        current: {
            is_day: currentWeather["current"]["is_day"],
            temperature: currentWeather["current"]["temperature_2m"],
            apparentTemperature: currentWeather["current"]["apparent_temperature"],
            weatherCode: currentWeather["current"]["weathercode"],
            icon: getWeatherDescription(currentWeather["current"]["weathercode"], Boolean(currentWeather["current"]["is_day"]))
        },
        hourly: {
            times: Object.values(hourlyWeather["hourly"]["time"]).slice(12),
            temperatures: Object.values(hourlyWeather["hourly"]["temperature_2m"]),
            apparentTemperatures: Object.values(hourlyWeather["hourly"]["apparent_temperature"]).slice(12),
            pops: Object.values(hourlyWeather["hourly"]["precipitation_probability"]).slice(12),
            rains: Object.values(hourlyWeather["hourly"]["rain"]).slice(12),
            snowfalls: Object.values(hourlyWeather["hourly"]["snowfall"]).slice(12),
            windSpeeds: Object.values(hourlyWeather["hourly"]["wind_speed_10m"]).slice(12),
            windDirections: Object.values(hourlyWeather["hourly"]["wind_direction_10m"]).slice(12),
            windGusts: Object.values(hourlyWeather["hourly"]["wind_gusts_10m"]).slice(12),
            weatherCodes: Object.values(hourlyWeather["hourly"]["weather_code"]).slice(12),
            icons: Object.values(hourlyWeather["hourly"]["weather_code"]).slice(12).map(code => getWeatherDescription(code, Boolean(currentWeather["current"]["is_day"])))
        }
    };
    res.json(data);
}

exports.weekly = async (req, res) => {
    const { country, region, city } = req.params;
    const { latitude, longitude, stateCode } = getLocation(country, region, city);
    const currentWeather = await getCurrentWeather(latitude, longitude);
    const weeklyWeather = await getWeeklyWeather(latitude, longitude);

    const data = {
        time: currentWeather["current"]["time"],
        latitude: latitude,
        longitude: longitude,
        country: country,
        region: region,
        city: city,
        stateCode: stateCode,
        timezone: currentWeather["timezone"],
        current: {
            is_day: currentWeather["current"]["is_day"],
            temperature: currentWeather["current"]["temperature_2m"],
            apparentTemperature: currentWeather["current"]["apparent_temperature"],
            humidity: currentWeather["current"]["relativehumidity_2m"],
            pressure: currentWeather["current"]["pressure_msl"],
            windSpeed: currentWeather["current"]["windspeed_10m"],
            windDirection: currentWeather["current"]["winddirection_10m"],
            windGust: currentWeather["current"]["windgusts_10m"],
            visibility: currentWeather["current"]["visibility"],
            weatherCode: currentWeather["current"]["weathercode"],
            icon: getWeatherDescription(currentWeather["current"]["weathercode"], Boolean(currentWeather["current"]["is_day"])),
            sunrise: currentWeather["daily"]["sunrise"][0],
            sunset: currentWeather["daily"]["sunset"][0]
        },
        weekly: {
            times: Object.values(weeklyWeather["daily"]["time"]).slice(1),
            temperatures: Object.values(weeklyWeather["daily"]["temperature_2m_max"]).slice(1),
            apparentTemperatures: Object.values(weeklyWeather["daily"]["apparent_temperature_max"]).slice(1),
            sunshineDurations: Object.values(weeklyWeather["daily"]["sunshine_duration"]).slice(1),
            rains: Object.values(weeklyWeather["daily"]["rain_sum"]).slice(1),
            snowfalls: Object.values(weeklyWeather["daily"]["snowfall_sum"]).slice(1),
            pops: Object.values(weeklyWeather["daily"]["rain_sum"]).slice(1),
            windSpeeds: Object.values(weeklyWeather["daily"]["wind_speed_10m_max"]).slice(1),
            windDirections: Object.values(weeklyWeather["daily"]["wind_direction_10m_dominant"]).slice(1),
            windGusts: Object.values(weeklyWeather["daily"]["wind_gusts_10m_max"]).slice(1),
            weatherCode: Object.values(weeklyWeather["daily"]["weather_code"]).slice(1),
            icons: Object.values(weeklyWeather["daily"]["weather_code"]).slice(1).map(code => getWeatherDescription(code, Boolean(currentWeather["current"]["is_day"])))

        }
    };
    res.json(data);
}

exports.fortnight = async (req, res) => {
    const { country, region, city } = req.params;
    const { latitude, longitude, stateCode } = getLocation(country, region, city);
    const fortnightWeather = await getFortnightWeather(latitude, longitude);

    const data = {
        latitude: latitude,
        longitude: longitude,
        country: country,
        region: region,
        city: city,
        stateCode: stateCode,
        times: Object.values(fortnightWeather["daily"]["time"]),
        maxTemperatures: Object.values(fortnightWeather["daily"]["temperature_2m_max"]),
        minTemperatures: Object.values(fortnightWeather["daily"]["temperature_2m_min"]),
        weatherCodes: Object.values(fortnightWeather["daily"]["weather_code"]),
        icons: Object.values(fortnightWeather["daily"]["weather_code"]).map(code => getWeatherDescription(code, false))
    };
    res.json(data);
}

async function getUserLocation (req) {
    const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
    const ipinfoWrapper = new IPinfoWrapper(process.env.IP_TOKEN);

    ipinfoWrapper.lookupIp(ipAddress)
        .then((res) => {
            return {
                country: res["country"],
                region: res["region"],
                city: res["city"]
            }
        });
}

async function getCurrentWeather (latitude, longitude) {
    const curOpts = 'temperature_2m,relativehumidity_2m,apparent_temperature,is_day,weathercode,pressure_msl,windspeed_10m,winddirection_10m,windgusts_10m,visibility';
    const dailyOpts = 'sunrise,sunset';
    let url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude);
    url.searchParams.append('current', curOpts);
    url.searchParams.append('daily', dailyOpts);
    url.searchParams.append('timeformat', 'unixtime');
    url.searchParams.append('forecast_days', 1);
    url.searchParams.append('timezone', 'GMT');

    return await fetch(url)
        .then((res) => res.json())
        .then((data) => data);
}

async function getHourylyWeather (latitude, longitude) {
    const hourlyOpts = 'temperature_2m,apparent_temperature,precipitation_probability,rain,snowfall,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code';
    let url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude);
    url.searchParams.append('hourly', hourlyOpts);
    url.searchParams.append('timeformat', 'unixtime');
    url.searchParams.append('forecast_days', 3);
    url.searchParams.append('timezone', 'GMT');

    return await fetch(url)
        .then((res) => res.json())
        .then((data) => data);
}

async function getWeeklyWeather (latitude, longitude) {
    const dailyOpts = 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunshine_duration,rain_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant';
    let url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude);
    url.searchParams.append('daily', dailyOpts);
    url.searchParams.append('timeformat', 'unixtime');
    url.searchParams.append('forecast_days', 8);
    url.searchParams.append('timezone', 'GMT');

    return await fetch(url)
        .then((res) => res.json())
        .then((data) => data);
}

async function getFortnightWeather (latitude, longitude) {
    const opts = 'weather_code,temperature_2m_max,temperature_2m_min';
    let url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude);
    url.searchParams.append('daily', opts);
    url.searchParams.append('timeformat', 'unixtime');
    url.searchParams.append('forecast_days', 14);
    url.searchParams.append('timezone', 'GMT');

    return await fetch(url)
        .then((res) => res.json())
        .then((data) => data);
}

function getWeatherDescription(wmoCode, isDay) {
    return wmo_description[wmoCode.toString()][isDay ? 'day' : 'night'] || wmo_description['1'][isDay ? 'day' : 'night'];
}

function getLocation (country, region, city) {
    for (const area of areas) {
        if (area['iso2'].toLowerCase() === country.toLowerCase()) {
            for (const state of area['states']) {
                if (state['name'].toLowerCase() === region.toLowerCase()) {
                    for (const _city of state['cities']) {
                        if (_city['name'].toLowerCase() === city.toLowerCase()) {
                            return {
                                latitude: _city['latitude'],
                                longitude: _city['longitude'],
                                stateCode: state['state_code']
                            };
                        }
                    }
                }
            }
        }
    }
    return null;
}