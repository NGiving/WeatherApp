import Header from './Header.js';
import Footer from './Footer.js';
import Taskbar from './Taskbar.js';
import WeatherChart from './WeatherChart.js';
import { useState, useEffect } from 'react';

function MainContainer() {
    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        fetch(`/api${window.location.pathname}`)
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
    }, [])

    if (!isFetched) return null;
    let labels = data.times.map(time => new Date(time*1000).toLocaleString('en-US', { weekday:'short', day:'numeric', month:'numeric' }).replace(',', ''));
    let dayTemps = data.maxTemperatures.map(temp => Math.round(temp));
    let nightTemps = data.minTemperatures.map(temp => Math.round(temp));
    let city = data.city.charAt(0).toUpperCase() + data.city.slice(1);

    return (
        <main id="main-content">
            <h1>{city}, <abbr>{data.stateCode}</abbr> Weather</h1>
            <WeatherChart labels={labels} dayTemps={dayTemps} nightTemps={nightTemps} />
        </main>
    );
}

export default function Fortnight() {
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