import logo from '../assets/images/logo.png';
import LocationForm from "./LocationForm";
import { NavLink } from 'react-router-dom';

function MenuButton() {
    return (
        <div style={{ textAlign: "center" }}>
            <div id="hamburger-lines">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

function LogoBanner() {
    return (
        <div id="banner">
            <a href="/" className="font--family-roboto ">
                <img src={logo} alt="Logo"
                    width={"96px"} height={"96px"} />
                Weather
            </a>
        </div>
    );
}

function MenuBar() {
    return (
        <div id="menu-bar">
            <MenuButton />
            <LocationForm />
        </div>
    );
}

function TrendsBar() {

    return (
        <div id="trends-bar">
            <ul className="trends-bar--list">
                <li>
                    <NavLink to={`/hourly/${window.location.pathname.split('/').slice(2).join('/')}`}>Hourly</NavLink>
                </li>
                <li>
                    <NavLink to={`/weekly/${window.location.pathname.split('/').slice(2).join('/')}`}>7 Days</NavLink>
                </li>
                <li>
                    <NavLink to={`/fortnight/${window.location.pathname.split('/').slice(2).join('/')}`}>14 Days</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default function Header() {
    return (
        <header id="main-header">
            <LogoBanner />
            <MenuBar />
            <TrendsBar />
        </header>
    );
}