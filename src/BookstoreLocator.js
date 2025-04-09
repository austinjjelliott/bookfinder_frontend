import React, { useState } from "react";
import BooklyAPI from "./api";
import "./BookstoreLocator.css";

function BookstoreLocator() {
  const [searchInput, setSearchInput] = useState("");
  const [places, setPlaces] = useState([]);

  // Handle changes to the search input field
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchInput.trim() === "") return; // Prevent empty searches

    try {
      const results = await BooklyAPI.searchPlaces(searchInput);
      console.log("Results:", results); // Log the results to see if they are received
      setPlaces(results);
    } catch (error) {
      console.error("Error fetching results:", error);
      setPlaces([]); // Clear previous results on error
    }
  };

  return (
    <div className="outer-container">
      {" "}
      <div className="container">
        <h1 className="header">Find a Bookstore Near You</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="form"
            type="text"
            placeholder="Search By City Or Zip"
            value={searchInput}
            onChange={handleInputChange}
            autoFocus
          />
          <button className="btn" type="submit">
            Search
          </button>
        </form>

        <div className={places?.length ? "results-display" : ""}>
          {places?.length === 0 ? (
            <p>No results. Try searching for a different city!</p>
          ) : (
            places?.map((place, idx) => {
              const name = place.name || "No name available";
              const address = place.address || "No address available";
              return (
                <div key={idx} className="result-item">
                  <h2>{name}</h2> {/* Display place name */}
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      place.address
                    )}`} // Google Maps search link
                    target="_blank" // Open in a new tab
                    rel="noopener noreferrer" // Security for opening in new tab
                  >
                    {place.address}
                  </a>{" "}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default BookstoreLocator;
