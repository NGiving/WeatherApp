import Header from "./Header";
import Taskbar from "./Taskbar";
import Footer from "./Footer";
import { useState, useEffect } from 'react';
import degToCompass from "../helpers/degToCompass";

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
                </div>
                <span className="weather-condition">{description}</span>
            </div>
            <HourlyWeatherCard data={data.hourly} />
        </>
    );
}

function HourlyWeatherCard({ data }) {
    const [index, setIndex] = useState(1);
    if (!data) return null;
    function handleNextClick() {
        if (index < data.times.legnth/6) setIndex(index + 1);
    }

    function handlePrevClick() {
        if (index > 1) setIndex(index - 1);
    }

    function WeatherColumn({ time, temp, apTemp, pop, rain, snowfall, windSpeed, windDir, windGust, icon }) {
        let date = new Date(time * 1000);
        let snow = snowfall === 0 ? '-' : snowfall < 1 ? '<1' : snowfall;
        let rainfall = rain === 0 ? '-' : rain < 1 ? '<1' : rain;

        return (
            <div className="hourly__column--seven hourly__column">
                <div className="hourly__row">
                    <span className="day">{date.toLocaleString('en-US', { weekday: "short" })}</span>
                    <span className="date">{date.toLocaleString('en-US', { hour: 'numeric', hour12: true })}</span>
                </div>
                <div className="hourly__row">
                    <span className="weekly__description">{icon.description}</span>
                </div>
                <div className="hourly__row weekly__icon">
                    <img src={icon.image} alt={icon.description} width={"80px"} height={"80px"} />
                </div>
                <div className="hourly__row">
                    <span className="weekly__period-temp">{temp}</span>
                    <span className="weekly__period-deg">°</span>
                </div>
                <div className="hourly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{apTemp}</span>
                </div>
                <div className="hourly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{pop}</span>
                </div>
                <div className="hourly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{windSpeed}</span>
                    <span className="metric">{windDir}</span>
                </div>
                <div className="hourly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{windGust}</span>
                </div>
                <div className="hourly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{rainfall}</span>
                    <span className="metric">{Boolean(rain) ? 'mm' : ''}</span>
                </div>
                <div className="hourly__row hourly__detailed-metrics stripe">
                    <span className="weekly__obs">{snow}</span>
                    <span className="metric">{Boolean(snowfall) ? 'mm' : ''}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="hourly-container">
            <div className="hourly__title">Hourly Forecast</div>
            <span className="tools">
                <div className="toggle">
                    <div className="cell">
                        <a onClick={handlePrevClick}>prev</a>
                        <span> | </span>
                        <a onClick={handleNextClick}>next</a>
                    </div>
                </div>
            </span>
            <div className="hourly__summary">{new Date(data.times[0]*1000).toLocaleString('en-US', { weekday:'long', month:'long', day:'numeric' })} - {new Date(data.times[data.times.length-1]*1000).toLocaleString('en-US', { weekday:'long', month:'long', day:'numeric' })}</div>
            <div className="six-day-table">
                <div className="hourly__legend">
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">Feels like</div>
                    </div>
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">POP</div>
                    </div>
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">Wind (km/h)</div>
                    </div>
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">Wind gust (km/h)</div>
                    </div>
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">Hrs Of Sun</div>
                    </div>
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">24 Hr Rain</div>
                    </div>
                    <div className="hourly__row hourly__detailed-metrics">
                        <div className="hourly__legend-column">24 Hr Snow</div>
                    </div>
                </div>
                {
                    [...Array(index * 6)].map((x, i) => {
                        return <WeatherColumn key={i} time={data.times[i]} icon={data.icons[i]} temp={Math.round(data.temperatures[i])}
                            apTemp={Math.round(data.apparentTemperatures[i])} pop={Math.round(data.pops[i])} windSpeed={Math.round(data.windSpeeds[i])}
                            windDir={degToCompass(data.windDirections[i])} windGust={Math.round(data.windGusts[i])} rain={data.rains[i]} snowfall={data.snowfalls[i]} />
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

export default function Hourly() {
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