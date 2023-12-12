import { useState, useEffect } from "react";
import Header from "./Header";
import Taskbar from "./Taskbar";
import Footer from "./Footer";
import degToCompass from "../helpers/degToCompass.js";

function CurrentWeatherCard() {
    const [data, setData] = useState();
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        fetch(`${window.location.pathname}`)
            .then(res => {
                if (res.status !== 200)
                    throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                setData(data);
                setIsFetched(true);
            })
            .catch(err => console.error(err))
    }, []);

    if (!isFetched) return null;
    let city = data.city.charAt(0).toUpperCase() + data.city.slice(1);
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }
    let time = new Date(data.time * 1000).toLocaleString('en-US', options);
    let { description, image } = data.current.icon;
    let sunriseTime = new Date(data.current.sunrise * 1000);
    let sunsetTime = new Date(data.current.sunset * 1000);

    return (
        <>
            <div className="current-obs">
                <h1>{city}, <abbr>{data.stateCode}</abbr> Weather</h1>
                <span id="updateon">Updated on {time}.</span>
                <div className="obs-area">
                    <span className="temp">{Math.round(data.current.temperature)}</span>
                    <div className="obs-area__units">
                        <div className="unit-container">
                            <span>°C</span>
                        </div>
                        <p className="feels-like">
                            <span className="label">Feels like</span>
                            <span className="value">{Math.round(data.current.apparentTemperature)}</span>
                        </p>
                    </div>
                    <div className="obs-icon">
                        <img src={image} alt={description} width={"96px"} />
                    </div>
                </div>
                <span className="weather-condition">{description}</span>

                <div className="secondary-obs-area">
                    <div className="detailed-metrics">
                        <span className="label">Wind</span>
                        <span className="value">{Math.round(data.current.windSpeed)}</span>
                        <div>
                            <span className="vector">{degToCompass(data.current.windDirection)}</span>
                            <span className="metric">km/h</span>
                        </div>
                    </div>
                    <div className="detailed-metrics">
                        <span className="label">Humidity</span>
                        <span className="value">{data.current.humidity}</span>
                        <div>
                            <span className="vector">%</span>
                            <span className="metric"></span>
                        </div>
                    </div>
                    <div className="detailed-metrics">
                        <span className="label">Visibility</span>
                        <span className="value">{Math.round(data.current.visibility / 1000)}</span>
                        <div>
                            <span className="vector">km</span>
                            <span className="metric"></span>
                        </div>
                    </div>
                    <div className="detailed-metrics">
                        <span className="label">Sunrise</span>
                        <span className="value">{`${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`}</span>
                        <div>
                            <span className="vector">AM</span>
                            <span className="metric"></span>
                        </div>
                    </div>
                    <div className="detailed-metrics">
                        <span className="label">Wind gust</span>
                        <span className="value">{Math.round(data.current.windGust)}</span>
                        <div>
                            <span className="vector">km/h</span>
                            <span className="metric"></span>
                        </div>
                    </div>
                    <div className="detailed-metrics">
                        <span className="label">Pressure</span>
                        <span className="value">{Math.round(data.current.pressure)}</span>
                        <div>
                            <span className="vector">hPa</span>
                            <span className="metric"></span>
                        </div>
                    </div>
                    <div className="detailed-metrics">
                        <span className="label">Sunset</span>
                        <span className="value">{`${sunsetTime.getHours() % 12}:${sunsetTime.getMinutes()}`}</span>
                        <div>
                            <span className="vector">PM</span>
                            <span className="metric"></span>
                        </div>
                    </div>
                </div>
            </div>
            <WeeklyWeatherCard data={data.weekly} />
        </>
    );
}

function WeeklyWeatherCard({ data }) {
    if (!data) return null;
    function WeatherColumn({ time, icon, temperature, apparentTemperature, pop, windSpeed, windDirection, windGust, sunshineDuration, rain, snowfall }) {
        let date = new Date(time * 1000);
        let snow = snowfall === 0 ? '-' : snowfall < 1 ? '<1' : snowfall;
        let rainfall = rain === 0 ? '-' : rain < 1 ? '<1' : rain;

        return (
            <div className="weely__column--seven weekly__column">
                <div className="weekly__row">
                    <span className="day">{date.toLocaleString('en-US', { weekday: "short" })}</span>
                    <span className="date">{date.toLocaleString('en-US', { day: "numeric", month: "numeric" })}</span>
                </div>
                <div className="weekly__row">
                    <span className="weekly__description">{icon.description}</span>
                </div>
                <div className="weekly__row weekly__icon">
                    <img src={icon.image} alt={icon.description} width={"80px"} height={"80px"} />
                </div>
                <div className="weekly__row">
                    <span className="weekly__period-temp">{temperature}</span>
                    <span className="weekly__period-deg">°</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{apparentTemperature}</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{pop}</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{windSpeed}</span>
                    <span className="metric">{windDirection}</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{windGust}</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{sunshineDuration}</span>
                    <span className="metric">h</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{rainfall}</span>
                    <span className="metric">{Boolean(rain) ? 'mm' : ''}</span>
                </div>
                <div className="weekly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{snow}</span>
                    <span className="metric">{Boolean(snowfall) ? 'mm' : ''}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="weekly-container">
            <span className="weekly__title">Next 7 Days</span>
            <div className="seven-day-table">
                <div className="weekly__legend">
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">Feels like</div>
                    </div>
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">POP</div>
                    </div>
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">Wind (km/h)</div>
                    </div>
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">Wind gust (km/h)</div>
                    </div>
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">Hrs Of Sun</div>
                    </div>
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">24 Hr Rain</div>
                    </div>
                    <div className="weekly__row hourly__detailed-metrics">
                        <div className="weekly__legend-column">24 Hr Snow</div>
                    </div>
                </div>
                {
                    [...Array(7)].map((x, i) => {
                        return <WeatherColumn key={i} time={data.times[i]} icon={data.icons[i]} temperature={Math.round(data.temperatures[i])}
                            apparentTemperature={Math.round(data.apparentTemperatures[i])} pop={Math.round(data.pops[i])} windSpeed={Math.round(data.windSpeeds[i])}
                            windDirection={degToCompass(data.windDirections[i])} windGust={Math.round(data.windGusts[i])}
                            sunshineDuration={Math.round(data.sunshineDurations[i] / 3600)} rain={data.rains[i]} snowfall={data.snowfalls[i]} />
                    })
                }
            </div>
        </div>
    );
}

function MainContainer() {
    return (
        <main id="main-content">
            <CurrentWeatherCard />
        </main>
    );
}

export default function Weekly() {
    return (
        <>
            <div className="main-container">
                <Taskbar />
                <Header />
                <MainContainer />
            </div>
            <Footer />
        </>
    );
}