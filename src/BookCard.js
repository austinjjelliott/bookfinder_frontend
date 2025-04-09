import React from "react";
import "./BookCard.css";
import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <div className="book-card">
      <Link to={`/books/${book.id}`}>
        {book.thumbnail && (
          <img
            src={book.thumbnail}
            alt={`Cover of ${book.title}`}
            className="book-card__thumbnail"
          />
        )}
        <div className="book-card__details">
          <p className>
            <strong>Title:</strong> {book.title}
          </p>
          {book.authors && book.authors.length > 0 && (
            <p>
              <strong>Author(s):</strong> {book.authors.join(", ")}
            </p>
          )}
          <p>
            <strong>Description:</strong> {book.description}
          </p>
          {book.publishedDate && (
            <p>
              <small>Published: {book.publishedDate}</small>
            </p>
          )}
          {book.pageCount && (
            <p>
              <small>Page Count: {book.pageCount}</small>
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export default BookCard;

//Future improvement: Limit text length of books.description with a read more button to expand
