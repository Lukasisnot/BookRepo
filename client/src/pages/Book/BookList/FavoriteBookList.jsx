import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react"; // useMemo kept for consistency if SearchBar uses it
import api from "../../../api"; // Assuming api setup is the same
import SearchBar from "../../../components/SearchBar"; // Reusing SearchBar

const BookLinkPlaceholder = ({ _id, title, author, publishedYear }) => (
  <Link
    to={`/book/${_id}`}
    className="block p-5 sm:p-6 bg-slate-800/80 hover:bg-slate-700/90 rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
  >
    <h3 className="text-xl font-semibold text-sky-300 mb-1 truncate">{title}</h3>
    <p className="text-sm text-slate-400 mb-0.5 truncate">
      By: {author?.name || (typeof author === 'string' ? author : "Unknown Author")}
    </p>
    {publishedYear && (
      <p className="text-xs text-slate-500">Published: {publishedYear}</p>
    )}
  </Link>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-10 w-10 text-sky-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function FavoriteBookList() {
  const [rawBooks, setRawBooks] = useState([]); // Favorite books fetched from API
  const [displayedBooks, setDisplayedBooks] = useState([]); // Favorite books to render (filtered or all)
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavoriteBooks = async () => {
      setLoaded(false);
      setError(null);
      setRawBooks([]);
      setDisplayedBooks([]);
      try {
        const response = await api.get("/user/me/favorites");
        if (response.status === 200 && response.data.payload && response.data.payload.favoriteBooks) {
          setRawBooks(response.data.payload.favoriteBooks);
          // SearchBar will handle initial population of displayedBooks via onSearchResults
          // (when dataSource updates and search term is empty, it should call onSearchResults with all items)
        } else {
          // This case might not be hit if backend always sends a payload or an error
          setError("Could not retrieve your favorite books at this time.");
        }
      } catch (err) {
        console.error("Error fetching favorite books:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Please log in to view your favorite books.");
          } else if (err.response.status === 404) {
            // This could mean user not found, or the favorites endpoint specific logic for no favorites.
            // For now, assuming it implies no favorites if user is valid.
            setError("User data not found or no favorites to display.");
            setRawBooks([]); // Ensure books are empty on 404
          } else {
            setError(`Server error: ${err.response.status}. Please try again later.`);
          }
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An unexpected error occurred while fetching your favorite books.");
        }
      } finally {
        setLoaded(true);
      }
    };

    loadFavoriteBooks();
  }, []);

  const handleSearchResults = useCallback((results, term) => {
    setDisplayedBooks(results);
    setActiveSearchTerm(term);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
        <div className="pt-20 sm:pt-24">
          <header className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500">
              My Favorite Books
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
              A collection of tomes you hold dear.
            </p>
          </header>

          {/* Search Bar Integration - only show if there are favorites or user is actively searching */}
          {isLoaded && (rawBooks.length > 0 || activeSearchTerm) && !error && (
             <SearchBar
                dataSource={rawBooks}
                searchKeys={['title', 'publishedYear', 'author.name']} // Ensure these keys match your book object structure
                onSearchResults={handleSearchResults}
                placeholder="Search your favorites..."
                ariaLabel="Search favorite books"
             />
          )}

          {!isLoaded && (
            <div className="text-center py-10">
              <LoadingSpinner />
              <p className="mt-4 text-slate-300 text-lg">Loading Your Favorite Books...</p>
            </div>
          )}

          {isLoaded && error && (
            <div className="max-w-xl mx-auto bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-lg text-center">
              <p className="font-semibold">Oops! Something went wrong.</p>
              <p className="text-sm">{error}</p>
              {error.includes("Please log in") && (
                 <Link
                    to="/login"
                    className="mt-4 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all"
                  >
                    Go to Login
                  </Link>
              )}
            </div>
          )}

          {/* Case: Loaded, no error, no favorite books initially, and not currently searching */}
          {isLoaded && !error && rawBooks.length === 0 && !activeSearchTerm && (
            <div className="max-w-xl mx-auto bg-slate-800/70 text-slate-300 px-6 py-8 rounded-lg text-center shadow-xl">
              <h2 className="text-2xl font-semibold text-sky-400 mb-3">Your Favorites List is Empty</h2>
              <p className="mb-6">You haven't marked any books as favorites yet. Explore the library and add some!</p>
              <Link
                to="/books" // Link to the main book list page
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Browse All Books
              </Link>
            </div>
          )}

          {/* Case: Loaded, no error, but search yielded no results from existing favorites */}
          {isLoaded && !error && displayedBooks.length === 0 && activeSearchTerm && (
             <div className="max-w-xl mx-auto text-slate-300 px-6 py-8 rounded-lg text-center">
              <h2 className="text-2xl font-semibold text-sky-400 mb-3">No Matches Found</h2>
              <p>No favorite books found matching "{activeSearchTerm}".</p>
            </div>
          )}

          {/* Case: Loaded, no error, and there are favorite books to display */}
          {isLoaded && !error && displayedBooks.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {displayedBooks.map((book) => (
                <BookLinkPlaceholder
                  key={book._id}
                  _id={book._id}
                  title={book.title}
                  author={book.author}
                  publishedYear={book.publishedYear}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/books" // Or "/" if that's your main book list or home
              className="inline-block px-8 py-3 bg-slate-700 hover:bg-slate-600/90 text-slate-100 font-semibold rounded-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
            >
              ← Back to All Books
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}