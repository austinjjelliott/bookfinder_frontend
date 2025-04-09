import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import BooklyAPI from "./api";
import DOMPurify from "dompurify"; //THIS Is to clean up the source code, get rid of the raw HTML that the API was giving
import UserContext from "./UserContext";
import "./BookDetail.css";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchBook() {
      const singleBook = await BooklyAPI.getSingleBook(id);
      setBook(singleBook.volumeInfo);
    }
    fetchBook();
    setIsLoading(false);
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!currentUser) {
      alert("Please log in to add books to your favorites.");
      return;
    }

    try {
      // Ensure the favorites list exists (if not, initialize as an empty array)
      const updatedFavorites = currentUser.favorites
        ? [...currentUser.favorites, book.title]
        : [book.title];

      // Update favorites using the API
      const updatedFavoritesList = await BooklyAPI.updateFavorites(
        currentUser.username,
        updatedFavorites
      );

      // Update the current user's state with the new favorites list
      setCurrentUser((prevUser) => ({
        ...prevUser,
        favorites: updatedFavoritesList,
      }));

      // Store updated favorites in localStorage specific to the user
      localStorage.setItem(
        `favorites-${currentUser.username}`,
        JSON.stringify(updatedFavoritesList)
      );

      alert("Book added to favorites!");
    } catch (err) {
      console.error("Error adding book to favorites:", err);
    }
  };

  //

  //

  if (isLoading) return <h3>Loading Page...</h3>;
  if (!book) return <h3>No Book Found. Please visit homepage and try again</h3>;
  const sanitizedDescription = DOMPurify.sanitize(book.description);

  return (
    <div className="BookDetail">
      <div className="book-card">
        {book?.imageLinks?.thumbnail ? (
          <img
            src={book.imageLinks.thumbnail}
            alt={`Cover of ${book.title}`}
            className="book-card__thumbnail"
          />
        ) : (
          <p>No Cover Image</p>
        )}

        <div className="book-card__details">
          <p>
            <strong>Title:</strong> {book.title}
          </p>
          <p>
            <strong>Author(s):</strong> {book.authors}
          </p>

          <p>
            <strong>Description:</strong>
            <span dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
            {/* ALL of this extra stuff was to clean up the raw HTML that the API was giving us. It looks cleaner on BookCard cuz its cleaned up by <Link> */}
          </p>

          <p>
            <small>Published: {book.publishedDate}</small>
          </p>
          <p>
            <small>Page Count: {book.pageCount}</small>
          </p>
          {/* Add the 'Add to Favorites' button only if the user is logged in */}

          {currentUser && (
            <button onClick={handleAddToFavorites}>Add to Favorites</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
