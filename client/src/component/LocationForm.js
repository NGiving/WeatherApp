import { useState } from "react";
import { redirect, Route } from "react-router-dom";

export default function LocationForm({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        // onSearch(inputValue);
        console.log(inputValue)
        return <Route loader={async () => redirect('http://localhost:3000/weekly/ca/ontario/torono')} />
        setInputValue('');
    }

    return (
        <form onSubmit={handleSubmit} id="location-form">
            <input type="search" name="q" value={inputValue} onChange={handleChange}
                id="location" placeholder="Search for location" />
            <button>Search</button>
        </form>
    );
}