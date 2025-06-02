import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react"; // useMemo removed as not directly used here
import api from "../../../api";
import SearchBar from "../../../components/SearchBar";

// Modified BookLinkPlaceholder to include star button
const BookLinkPlaceholder = ({ _id, title, author, publishedYear, isStarred, onToggleStar }) => (
  <div className="relative group">
    <Link
      to={`/book/${_id}`}
      className="block p-5 sm:p-6 bg-slate-800/80 hover:bg-slate-700/90 rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      {/* Added pr-10 or similar to make space for the star button if it overlaps significantly */}
      <h3 className="text-xl font-semibold text-sky-300 mb-1 truncate pr-10">{title}</h3>
      <p className="text-sm text-slate-400 mb-0.5 truncate">
        By: {author?.name || (typeof author === 'string' ? author : "Unknown Author")}
      </p>
      {publishedYear && (
        <p className="text-xs text-slate-500">Published: {publishedYear}</p>
      )}
    </Link>
    {/* Star Button - only render if onToggleStar is provided */}
    {onToggleStar && (
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent Link navigation if star is clicked
          e.stopPropagation();
          onToggleStar(_id);
        }}
        className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 z-10 transition-colors"
        aria-label={isStarred ? `Unstar ${title}` : `Star ${title}`}
        title={isStarred ? `Unstar book` : `Star book`}
      >
        {isStarred ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434L10.788 3.21z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.518a.563.563 0 01.329.89l-4.462 3.242a.563.563 0 00-.192.518l1.6 5.171a.563.563 0 01-.84.61l-4.725-3.354a.563.563 0 00-.652 0l-4.725 3.354a.563.563 0 01-.84-.61l1.6-5.171a.563.563 0 00-.192-.518l-4.462-3.242a.563.563 0 01.329-.89h5.518a.563.563 0 00.475-.31L11.48 3.5z" />
          </svg>
        )}
      </button>
    )}
  </div>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-10 w-10 text-sky-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function BookList() {
  const [rawBooks, setRawBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [starredBookIds, setStarredBookIds] = useState(new Set());
  const [starringError, setStarringError] = useState(null);

  // Load all books
  useEffect(() => {
    const loadBooks = async () => {
      setLoaded(false);
      setError(null);
      setRawBooks([]);
      setDisplayedBooks([]);
      try {
        const response = await api.get("/book");
        if (response.status === 200 && response.data.payload) {
          setRawBooks(response.data.payload);
        } else {
          setError("Could not retrieve books at this time.");
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        if (err.response) {
          if (err.response.status === 404) {
            setError("No books found in the collection.");
          } else {
            setError(`Server error: ${err.response.status}. Please try again later.`);
          }
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An unexpected error occurred while fetching books.");
        }
      } finally {
        setLoaded(true);
      }
    };
    loadBooks();
  }, []);

  // Load user's favorite book IDs
  useEffect(() => {
    const fetchUserFavorites = async () => {
      // Only fetch if initial books have loaded or tried to load
      if (!isLoaded) return; 
      try {
        const response = await api.get("/user/me/favorites");
        if (response.status === 200 && response.data.payload && response.data.payload.favoriteBooks) {
          const favoriteIds = new Set(response.data.payload.favoriteBooks.map(book => book._id));
          setStarredBookIds(favoriteIds);
        }
      } catch (err) {
        if (err.response && err.response.status !== 401) {
          console.error("Error fetching user favorites:", err);
          // Not setting starringError here, as it's for active operations
        } else if (!err.response && err.request) {
            console.error("Network error fetching user favorites:", err);
        }
        // If 401, starredBookIds remains empty, which is fine.
      }
    };
    fetchUserFavorites();
  }, [isLoaded]); // Re-fetch if isLoaded changes (e.g., after initial book load attempt)

  const handleSearchResults = useCallback((results, term) => {
    setDisplayedBooks(results);
    setActiveSearchTerm(term);
  }, []);

  const handleToggleStar = useCallback(async (bookId) => {
    setStarringError(null);
    const isCurrentlyStarred = starredBookIds.has(bookId);
    const originalStarredBookIds = new Set(starredBookIds);

    setStarredBookIds(prevStarredIds => {
      const newStarredIds = new Set(prevStarredIds);
      if (isCurrentlyStarred) {
        newStarredIds.delete(bookId);
      } else {
        newStarredIds.add(bookId);
      }
      return newStarredIds;
    });

    try {
      if (isCurrentlyStarred) {
        await api.delete(`/user/me/favorites/${bookId}`);
      } else {
        await api.post(`/user/me/favorites/${bookId}`, {});
      }
    } catch (err) {
      console.error("Error toggling star status:", err);
      setStarredBookIds(originalStarredBookIds); // Rollback
      if (err.response) {
        if (err.response.status === 401) {
          setStarringError("Please log in to manage your favorite books.");
        } else {
          setStarringError(err.response.data.error || "Failed to update favorite status.");
        }
      } else if (err.request) {
        setStarringError("Network error. Could not update favorite status.");
      } else {
        setStarringError("An unexpected error occurred.");
      }
    }
  }, [starredBookIds]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
        <div className="pt-20 sm:pt-24">
          <header className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl pb-2 sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500">
              The Grand Library
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
              Browse through our collected tomes.
            </p>
          </header>

          {isLoaded && (rawBooks.length > 0 || activeSearchTerm) && !error && (
             <SearchBar
                dataSource={rawBooks} 
                searchKeys={['title', 'publishedYear', 'author.name']}
                onSearchResults={handleSearchResults}
                placeholder="Search by title, author or year..."
                ariaLabel="Search books in the library"
             />
          )}

          {!isLoaded && (
            <div className="text-center py-10">
              <LoadingSpinner />
              <p className="mt-4 text-slate-300 text-lg">Loading Books...</p>
            </div>
          )}

          {isLoaded && error && (
            <div className="max-w-xl mx-auto bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-lg text-center">
              <p className="font-semibold">Oops! Something went wrong.</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isLoaded && !error && rawBooks.length === 0 && !activeSearchTerm && (
            <div className="max-w-xl mx-auto bg-slate-800/70 text-slate-300 px-6 py-8 rounded-lg text-center shadow-xl">
              <h2 className="text-2xl font-semibold text-sky-400 mb-3">The Shelves Are Bare</h2>
              <p className="mb-6">No books found in the collection at this moment.</p>
              <Link
                to="/createbook"
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Add First Book
              </Link>
            </div>
          )}

          {isLoaded && !error && displayedBooks.length === 0 && activeSearchTerm && (
             <div className="max-w-xl mx-auto text-slate-300 px-6 py-8 rounded-lg text-center">
              <h2 className="text-2xl font-semibold text-sky-400 mb-3">No Matches Found</h2>
              <p>No books found matching "{activeSearchTerm}". Try a different search.</p>
            </div>
          )}

          {isLoaded && !error && displayedBooks.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {displayedBooks.map((book) => (
                <BookLinkPlaceholder
                  key={book._id}
                  _id={book._id}
                  title={book.title}
                  author={book.author}
                  publishedYear={book.publishedYear}
                  isStarred={starredBookIds.has(book._id)}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
          )}

          {/* Starring Error Message Display */}
          {starringError && (
            <div 
              style={{
                position: 'fixed', bottom: '20px', left: '50%',
                transform: 'translateX(-50%)', backgroundColor: 'rgba(220, 38, 38, 0.95)',
                color: 'white', padding: '12px 24px', borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000,
                display: 'flex', alignItems: 'center', fontSize: '0.875rem',
              }}
            >
              <span>{starringError}</span>
              <button onClick={() => setStarringError(null)} 
                style={{ marginLeft: '16px', background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                aria-label="Dismiss error" title="Dismiss"
              >×</button>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-slate-700 hover:bg-slate-600/90 text-slate-100 font-semibold rounded-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
            >
              ← Back to Main
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}