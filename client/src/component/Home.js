import Header from "./Header";
import Taskbar from "./Taskbar";
import Footer from "./Footer";
import { useState, useEffect } from "react";

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
    return (
        <main id="main-content">
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