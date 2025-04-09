import React, { useState } from "react";
import BooklyAPI from "./api";
import BookCard from "./BookCard";
import "./Homepage.css";

function Homepage() {
  const [searchInput, setSearchInput] = useState("");
  const [books, setBooks] = useState([]);

  // Handle changes to the search input field
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchInput.trim() === "") return; // Prevent empty searches

    try {
      const results = await BooklyAPI.searchBooks(searchInput);
      setBooks(results);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]); // Clear previous results on error
    }
  };

  return (
    <div className="outer-container">
      {" "}
      <div className="container">
        <h1 className="header">Welcome To Bookfinder</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="bookfinder-form"
            type="text"
            placeholder="Search By Title, Author, Genre, or ISBN"
            value={searchInput}
            onChange={handleInputChange}
            autoFocus
          />
          <button className="bookfinder-btn" type="submit">
            Search
          </button>
        </form>

        <div className={books.length > 0 ? "bookcard-display" : ""}>
          {books.length > 0 ? (
            books.map((book) => <BookCard key={book.id} book={book} />)
          ) : (
            <p>No books found. Please try a different search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
