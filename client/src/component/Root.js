import Header from "./Header";
import Taskbar from "./Taskbar";
import Footer from "./Footer";

function MainContainer() {
    return <main id="main-content"></main>;
}

export default function Root() {
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