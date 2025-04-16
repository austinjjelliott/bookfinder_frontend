import axios from "axios";

const BASE_URL = "https://bookfinder-backend.onrender.com";
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const MAPQUEST_API_URL = "https://www.mapquestapi.com/search/v2/radius";
const MAPQUEST_API_KEY = process.env.REACT_APP_MAPQUEST_API_KEY;
// const MAPQUEST_API_KEY = "vIzRjqvib9fNtg4U067gRG0MuLSlfhsU";

class BooklyAPI {
  static token;

  // Set the JWT token for authorization
  static setToken(token) {
    this.token = token;
  }

  // Generic request method
  static async request(endpoint, data = {}, method = "get") {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const params = method === "get" ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error("API Error:", err.response);
      throw err.response.data;
    }
  }

  // User-related API calls to LOCAL backend
  static async login(credentials) {
    const res = await this.request("auth/token", credentials, "post");
    return res.token;
  }

  static async register(userData) {
    const res = await this.request("auth/register", userData, "post");
    return res.token;
  }

  static async getUser(username) {
    const res = await this.request(`users/${username}`);
    // console.log("Full response:", res); // DEBUGGING
    return res;
  }

  static async updateUser(username, userData) {
    const res = await this.request(`users/${username}`, userData, "patch");
    console.log("API Response after profile update:", res); // DEBUGGING: Log the response to verify
    return res;
  }

  // Book-related API calls to LOCAL backend

  static async addFavorite(bookData) {
    const res = await this.request("books/favorite", bookData, "post");
    return res.favorite;
  }

  static async getFavorites() {
    const res = await this.request("books/favorites");
    return res.favorites;
  }

  static async removeFavorite(bookId) {
    const res = await this.request(`books/favorite/${bookId}`, {}, "delete");
    return res.deleted;
  }

  static async updateFavorites(username, favorites) {
    const response = await fetch(
      `http://localhost:3001/users/${username}/favorites`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token
        },
        body: JSON.stringify({ favorites }),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating favorites");
    }

    const data = await response.json();
    return data.favorites; // Return the updated favorites list
  }

  // Google Books API call
  static async searchBooks(query) {
    try {
      const response = await axios.get(GOOGLE_BOOKS_API_URL, {
        params: { q: query, maxResults: 25 },
      });
      return response.data.items.map((book) => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        description: book.volumeInfo.description || "No description available",
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
        pageCount: book.volumeInfo.pageCount,
        publishedDate: book.volumeInfo.publishedDate,
      }));
    } catch (err) {
      console.error("Books API Error:", err.response);
      throw err.response.data;
    }
  }

  static async getSingleBook(id) {
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/${id}`);
      return response.data;
    } catch (err) {
      console.error("Book detail API Error:", err.response);
      throw err.response.data;
    }
  }

  // //MAPQUEST PLACES API CALL:

  static async searchPlaces(query) {
    try {
      // Step 1: Geocode the city to get lat/lng
      const geocodeResponse = await axios.get(
        "https://www.mapquestapi.com/geocoding/v1/address",
        {
          params: {
            key: MAPQUEST_API_KEY,
            location: query, // City or address input from user
          },
        }
      );

      console.log("Geocode Response:", geocodeResponse.data);

      const lat = geocodeResponse.data.results[0]?.locations[0]?.latLng?.lat;
      const lng = geocodeResponse.data.results[0]?.locations[0]?.latLng?.lng;

      if (!lat || !lng) {
        throw new Error("Unable to retrieve coordinates.");
      }

      // Step 2: Use Place Search to find bookshops near the retrieved lat/lng
      const placesResponse = await axios.get(
        "https://www.mapquestapi.com/search/v4/place",
        {
          params: {
            key: MAPQUEST_API_KEY,
            location: `${lng},${lat}`, // Longitude, Latitude
            q: "bookshop", // Search term for bookshops
            sort: "relevance", // FUTURE UPDATE: allow user to choose sort type (relevance, distance, etc)
            limit: 25, // FUTURE UPDATE: Let User choose Limit
          },
        }
      );

      console.log("Places Response:", placesResponse.data);

      // Return the list of bookshops
      return placesResponse.data.results.map((place) => ({
        name: place.name,
        address: place.displayString,
      }));
    } catch (error) {
      console.error("Error:", error);
      throw new Error("An error occurred while fetching places.");
    }
  }
}

export default BooklyAPI;
