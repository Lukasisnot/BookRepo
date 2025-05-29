import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import api from "../../../api";
import SearchBar from "../../../components/SearchBar"; // Adjust path if necessary

// LiteraryGroupCard and LoadingSpinner remain the same
const LiteraryGroupCard = ({ _id, name, years, characteristics }) => (
  <Link
    to={`/literary-group/${_id}`}
    className="block p-5 sm:p-6 bg-slate-800/80 hover:bg-slate-700/90 rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
  >
    <h3 className="text-xl font-semibold text-sky-300 mb-1 truncate">{name}</h3>
    <p className="text-sm text-slate-400 mb-0.5 truncate">{characteristics || "No description"}</p>
    {years && <p className="text-xs text-slate-500">Years: {years}</p>}
  </Link>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-10 w-10 text-sky-400 mx-auto"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function LiteraryGroupList() {
  const [groups, setGroups] = useState([]); // Original full list of groups
  const [displayedGroups, setDisplayedGroups] = useState([]); // Groups to display (can be filtered)
  const [activeSearchTerm, setActiveSearchTerm] = useState(""); // To show what was searched for
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load all groups initially
  useEffect(() => {
    const loadInitialGroups = async () => {
      setLoaded(false);
      setError(null);
      try {
        const response = await api.get("/literary-group");
        if (response.status === 200 && response.data.payload) {
          setGroups(response.data.payload);
          // displayedGroups will be set by SearchBar's onSearchResults
        } else {
          setGroups([]);
          setError("Failed to fetch Literary Groups.");
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        setGroups([]);
        if (err.response?.status === 404) {
          setError("No Literary Groups found in the collection.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred while fetching groups.");
        }
      } finally {
        setLoaded(true);
      }
    };

    loadInitialGroups();
  }, []);

  // Callback for SearchBar
  const handleSearchResults = useCallback((results, term) => {
    setDisplayedGroups(results);
    setActiveSearchTerm(term);
  }, []); // Dependencies are stable setters

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
      <div className="pt-20 sm:pt-24">
        <header className="text-center mb-6 sm:mb-8"> {/* Reduced bottom margin for search bar */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-sky-500">
            Literary Movements
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Explore historical groups and their defining traits.
          </p>
        </header>

        {/* Search Bar Integration */}
        {isLoaded && !error && ( // Only show search bar if loaded and no critical error
          <div className="mb-8 sm:mb-10">
            <SearchBar
              dataSource={groups}
              searchKeys={['name', 'characteristics', 'years']} // Keys to search
              onSearchResults={handleSearchResults}
              placeholder="Search movements by name, traits or years..."
              ariaLabel="Search literary movements"
            />
          </div>
        )}

        {!isLoaded && (
          <div className="text-center py-10">
            <LoadingSpinner />
            <p className="mt-4 text-slate-300 text-lg">Loading Literary Groups...</p>
          </div>
        )}

        {isLoaded && error && groups.length === 0 && ( // Show error if loading finished with error AND no groups
          <div className="max-w-xl mx-auto bg-red-900/50 border border-red-700 text-red-300 px-6 py-4 rounded-lg text-center">
            <p className="font-semibold">Oops! Something went wrong.</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Condition for no groups found */}
        {isLoaded && !error && displayedGroups.length === 0 && (
          <div className="max-w-xl mx-auto bg-slate-800/70 text-slate-300 px-6 py-8 rounded-lg text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-sky-400 mb-3">
              {activeSearchTerm ? `No Movements Found Matching "${activeSearchTerm}"` : "No Literary Movements Yet"}
            </h2>
            <p className="mb-6">
              {activeSearchTerm
                ? "Try a different search term or clear the search."
                : "No literary groups available in the collection right now."}
            </p>
            {!activeSearchTerm && ( // Only show "Add" link if not in a search context
                 <Link
                    to="/createliterary-group" // Adjust if your route is different
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                    Add Literary Group
                </Link>
            )}
          </div>
        )}

        {/* Display groups if available */}
        {isLoaded && !error && displayedGroups.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
            {displayedGroups.map((group) => (
              <LiteraryGroupCard key={group._id} {...group} />
            ))}
          </div>
        )}

        {/* Show non-critical error even if some data is displayed */}
        {isLoaded && error && groups.length > 0 && displayedGroups.length > 0 && (
             <p className="text-center text-red-400 mt-6">
                {error} (Displaying available data)
             </p>
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
  );
}