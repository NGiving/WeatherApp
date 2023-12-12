export default function Taskbar() {
    return (
        <div id="taskbar" className=" font--family-roboto">
            <div className="taskbar__content-wrap">
                <span className="tagline">Weather forecast anywhere</span>
                <div className="site-options font--family-roboto">
                    <ul id="temp-units">
                        <li className="temp-unit-c">
                            <a className="tempunit font--family-roboto tempunit--active" href="/">°C</a>
                        </li>
                        <li className="temp-unit-f">
                            <a className="tempunit font--family-roboto" href="/">°F</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}