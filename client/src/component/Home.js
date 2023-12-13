import Header from "./Header";
import Taskbar from "./Taskbar";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import {OSM, TileDebug} from 'ol/source.js';

function MainContainer() {
    const [data, setData] = useState(null);
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        fetch('https://weather-app-api-ngiving.vercel.app/')
            .then(res => {
                if (res.status !== 200)
                    throw new Error(res.statusText);
                return res.text();
            })
            .then(data => {
                setData(data);
                setIsFetched(true);
            })
            .catch(err => console.error(err))
    }, []);
    if (!isFetched) return null;

    const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source: new TileDebug(),
          }),
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 1,
        }),
      });
    return (
        <main id="main-content">
            <div id="map" class="map"></div>
            <div className="map-container">
                <img id="world-map" src={`data:image/jpeg;base64,${data}`} alt="Weather map of the world" width={"600px"} height={"600px"} />
            </div> 
        </main>
    );
}

export default function Home() {
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