import { useState } from "react";

export default function LocationForm({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setInputValue('');
        alert(inputValue);
        // return <Redirect to={'https://weather-app-client-gilt.vercel.app/weekly/ca/ontario/torono'} />
    }

    return (
        <form onSubmit={handleSubmit} id="location-form">
            <input type="search" name="q" value={inputValue} onChange={handleChange}
                id="location" placeholder="Search for location" />
            <button>Search</button>
        </form>
    );
}