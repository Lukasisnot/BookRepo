import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";


const BookLinkPlaceholder = ({ _id, title, author, publishedYear }) => (
  <Link
    to={`/book/${_id}`} 
    className="block p-5 sm:p-6 bg-slate-800/80 hover:bg-slate-700/90 rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
  >
    <h3 className="text-xl font-semibold text-sky-300 mb-1 truncate">{title}</h3>
    <p className="text-sm text-slate-400 mb-0.5 truncate">
      By: {author?.name || author || "Unknown Author"}
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

export default function BookList() {
  const [books, setBooks] = useState([]); 
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadBooks = async () => {
      setLoaded(false);
      setError(null);
      try {
        const response = await api.get("/book");
        if (response.status === 200 && response.data.payload) {
          setBooks(response.data.payload);
        } else {
        
          setBooks([]); 
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
        setBooks([]); 
      } finally {
        setLoaded(true); 
      }
    };

    loadBooks();
  }, []);


  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
        <div className="pt-20 sm:pt-24">
          <header className="text-center mb-10 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500">
              The Grand Library
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
              Browse through our collected tomes.
            </p>
          </header>

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
          
          {isLoaded && !error && books.length === 0 && (
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

          {isLoaded && !error && books.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {books.map((book) => (
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
