import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../../../api";
import SearchBar from "../../../components/SearchBar";

// Modified BookLinkPlaceholder to include star button
const BookLinkPlaceholder = ({ _id, title, author, publishedYear, isStarred, onToggleStar }) => (
  <div className="relative group">
    <Link
      to={`/book/${_id}`}
      className="block p-5 sm:p-6 bg-slate-800/80 hover:bg-slate-700/90 rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      <h3 className="text-xl font-semibold text-sky-300 mb-1 truncate pr-10">{title}</h3>
      <p className="text-sm text-slate-400 mb-0.5 truncate">
        By: {author?.name || (typeof author === 'string' ? author : "Unknown Author")}
      </p>
      {publishedYear && (
        <p className="text-xs text-slate-500">Published: {publishedYear}</p>
      )}
    </Link>
    {onToggleStar && (
      <button
        onClick={(e) => {
          e.preventDefault();
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

export default function FavoriteBookList() {
  const [rawBooks, setRawBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [starredBookIds, setStarredBookIds] = useState(new Set());
  const [starringError, setStarringError] = useState(null);

  useEffect(() => {
    const loadFavoriteBooks = async () => {
      setLoaded(false);
      setError(null);
      setRawBooks([]);
      setDisplayedBooks([]);
      setStarredBookIds(new Set()); // Reset starred IDs
      try {
        const response = await api.get("/user/me/favorites");
        if (response.status === 200 && response.data.payload && response.data.payload.favoriteBooks) {
          const favBooks = response.data.payload.favoriteBooks;
          setRawBooks(favBooks);
          setStarredBookIds(new Set(favBooks.map(book => book._id))); // Populate from fetched favorites
        } else {
          setError("Could not retrieve your favorite books at this time.");
        }
      } catch (err) {
        console.error("Error fetching favorite books:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Please log in to view your favorite books.");
          } else if (err.response.status === 404) {
             // Assume 404 on this endpoint means user exists but has no favorites, or simply no data.
            setRawBooks([]); // Ensure books are empty, effectively "no favorites"
            // No explicit error needed if it just means "no favorites yet"
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

  const handleToggleStar = useCallback(async (bookId) => {
    setStarringError(null);
    const isCurrentlyStarred = starredBookIds.has(bookId); // Should always be true here initially
    const originalStarredBookIds = new Set(starredBookIds);
    const originalRawBooks = [...rawBooks]; // For rollback if unstarring fails

    // Optimistic UI Update
    setStarredBookIds(prevStarredIds => {
      const newStarredIds = new Set(prevStarredIds);
      if (isCurrentlyStarred) { // This implies unstarring
        newStarredIds.delete(bookId);
      } else { // This implies starring (less likely path here, but good for robustness)
        newStarredIds.add(bookId);
      }
      return newStarredIds;
    });

    if (isCurrentlyStarred) { // If unstarring, also optimistically remove from displayed lists
      setRawBooks(prev => prev.filter(b => b._id !== bookId));
      // SearchBar should update displayedBooks if its dataSource (rawBooks) changes reference.
      // To be safe, we can also filter displayedBooks directly based on the current search term
      // or let SearchBar handle it if it's robust to dataSource changes.
      // For now, SearchBar should handle displayedBooks when rawBooks (dataSource) changes.
    }


    try {
      if (isCurrentlyStarred) {
        await api.delete(`/user/me/favorites/${bookId}`);
        // Book is now unstarred, it should be removed from this list.
        // The optimistic update for rawBooks and starredBookIds handles this.
        // If displayedBooks are handled by SearchBar reacting to rawBooks, it's fine.
        // If not, manually update displayedBooks:
        setDisplayedBooks(prev => prev.filter(b => b._id !== bookId));

      } else {
        // This case (starring a book from the favorites list) implies the book somehow wasn't in starredBookIds
        // but was in rawBooks. This is an inconsistent state, but we'll handle API call.
        await api.post(`/user/me/favorites/${bookId}`, {});
        // If successful, ensure it's in rawBooks if it was somehow filtered out.
        // This path is less critical for this specific list.
      }
    } catch (err) {
      console.error("Error toggling star status:", err);
      // Rollback
      setStarredBookIds(originalStarredBookIds);
      if (isCurrentlyStarred) { // If unstarring failed, add book back to rawBooks
        setRawBooks(originalRawBooks);
         // And re-trigger search to update displayedBooks with original state
        // This can be tricky. A simpler rollback might be to just show an error and let user retry.
        // For robustness, if SearchBar doesn't auto-update displayedBooks on rawBooks change for rollback,
        // you might need to manually call something or re-filter.
        // For now, relying on SearchBar if rawBooks identity changes.
      }

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
  }, [starredBookIds, rawBooks]); // Add rawBooks as dependency due to its modification

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

          {isLoaded && (rawBooks.length > 0 || activeSearchTerm) && !error && (
             <SearchBar
                dataSource={rawBooks} // dataSource is now the list of favorite books
                searchKeys={['title', 'publishedYear', 'author.name']}
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
              {error && error.includes("Please log in") && ( // Check error existence before .includes
                 <Link
                    to="/login"
                    className="mt-4 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all"
                  >
                    Go to Login
                  </Link>
              )}
            </div>
          )}

          {isLoaded && !error && rawBooks.length === 0 && !activeSearchTerm && (
            <div className="max-w-xl mx-auto bg-slate-800/70 text-slate-300 px-6 py-8 rounded-lg text-center shadow-xl">
              <h2 className="text-2xl font-semibold text-sky-400 mb-3">Your Favorites List is Empty</h2>
              <p className="mb-6">You haven't marked any books as favorites yet. Explore the library and add some!</p>
              <Link
                to="/books"
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Browse All Books
              </Link>
            </div>
          )}

          {isLoaded && !error && displayedBooks.length === 0 && activeSearchTerm && (
             <div className="max-w-xl mx-auto text-slate-300 px-6 py-8 rounded-lg text-center">
              <h2 className="text-2xl font-semibold text-sky-400 mb-3">No Matches Found</h2>
              <p>No favorite books found matching "{activeSearchTerm}".</p>
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
                  isStarred={starredBookIds.has(book._id)} // Should mostly be true here
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
              to="/books"
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