import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api from "../../api"; // Assumed API client for fetching data
import SearchBar from "../../components/SearchBar"; // Reusable SearchBar component

// Color palettes for the books to provide visual variety
const colorPalettes = [
  {
    name: "Rose/Yellow",
    color: "bg-rose-600", // Main background color of the book cover
    borderColor: "border-rose-800", // Border color of the book cover
    textColor: "text-yellow-100", // Text color on the book cover and spine
    spineColor: "bg-rose-800", // Background color of the book spine
    tagColor: "bg-yellow-400 text-rose-800", // Background and text color for tags (like year, "Read Book" button)
  },
  {
    name: "Sky/Teal",
    color: "bg-sky-600",
    borderColor: "border-sky-800",
    textColor: "text-neutral-100",
    spineColor: "bg-sky-800",
    tagColor: "bg-teal-300 text-sky-900",
  },
  {
    name: "Emerald/Lime",
    color: "bg-emerald-600",
    borderColor: "border-emerald-800",
    textColor: "text-lime-100",
    spineColor: "bg-emerald-800",
    tagColor: "bg-lime-300 text-emerald-900",
  },
  {
    name: "Purple/Indigo",
    color: "bg-purple-600",
    borderColor: "border-purple-800",
    textColor: "text-indigo-100",
    spineColor: "bg-purple-800",
    tagColor: "bg-indigo-300 text-purple-900",
  },
  {
    name: "Orange/Amber",
    color: "bg-orange-500",
    borderColor: "border-orange-700",
    textColor: "text-amber-100",
    spineColor: "bg-orange-700",
    tagColor: "bg-amber-300 text-orange-900",
  },
  {
    name: "Slate/Cyan",
    color: "bg-slate-600",
    borderColor: "border-slate-800",
    textColor: "text-cyan-100",
    spineColor: "bg-slate-800",
    tagColor: "bg-cyan-400 text-slate-900",
  },
  {
    name: "Fuchsia/Pink",
    color: "bg-fuchsia-600",
    borderColor: "border-fuchsia-800",
    textColor: "text-pink-100",
    spineColor: "bg-fuchsia-800",
    tagColor: "bg-pink-300 text-fuchsia-900",
  },
  {
    name: "Green/Yellow",
    color: "bg-green-600",
    borderColor: "border-green-800",
    textColor: "text-yellow-50",
    spineColor: "bg-green-800",
    tagColor: "bg-yellow-400 text-green-900",
  },
];

/**
 * Book Component
 * Renders a single book item with styling, interactions, and a star toggle.
 * @param {object} book - The book data object.
 * @param {function} onBookClick - Callback function when the book is clicked.
 * @param {boolean} isSelected - True if the book is currently selected.
 * @param {boolean} isDesktop - True if the view is desktop-sized.
 * @param {object} bookRef - React ref for the book's DOM element.
 * @param {boolean} isStarred - True if the book is starred.
 * @param {function} onToggleStar - Callback function to toggle the star status.
 */
const Book = ({
  book,
  onBookClick,
  isSelected,
  isDesktop,
  bookRef,
  isStarred, // New prop: indicates if the book is starred
  onToggleStar, // New prop: callback to toggle star status
}) => {
  // Base heights for spine text calculation, differing for mobile and desktop
  const bookBaseHeightMobile = 260;
  const bookBaseHeightDesktop = 300;

  // Memoized random factor for book tilt, ensures tilt is consistent per book unless book.id changes
  const baseRandomFactor = useMemo(() => {
    return Math.random() - 0.5; // Generates a value between -0.5 and 0.5
  }, [book.id]); // Dependency: recalculate if book.id changes (unlikely for same book)

  // Memoized random tilt degree based on the base random factor and screen size
  const randomTiltDeg = useMemo(() => {
    const tiltMultiplier = isDesktop ? 15 : 5; // Larger tilt on desktop
    return baseRandomFactor * tiltMultiplier;
  }, [baseRandomFactor, isDesktop]); // Recalculate if factor or desktop status changes

  // Memoized dynamic styles for the book wrapper (transformations and z-index)
  const dynamicWrapperStyles = useMemo(() => {
    let transformValue = `rotate(${randomTiltDeg}deg)`; // Default tilt
    let zIndexValue = 10; // Default z-index

    // If the book is selected, apply different transformations and higher z-index
    if (isSelected) {
      zIndexValue = 40; // Bring selected book to the front
      if (isDesktop) {
        transformValue = `translateY(-48px) scale(1.1) rotate(0deg)`; // Pop-up effect on desktop
      } else {
        transformValue = `translateY(-20px) scale(1.05) rotate(0deg)`; // Pop-up effect on mobile
      }
    }

    return {
      transform: transformValue,
      zIndex: zIndexValue,
      willChange: "transform, z-index", // Hint for browser optimization
    };
  }, [isSelected, isDesktop, randomTiltDeg]); // Recalculate if selection, desktop status, or tilt changes

  // CSS class for a subtle 3D effect on the right edge of the book cover
  const coverPageEffect =
    "before:content-[''] before:absolute before:inset-y-0 before:right-0 before:w-[3px] before:bg-white/10 before:rounded-r-sm before:opacity-70";

  return (
    <div
      ref={bookRef} // Assign ref for scrolling into view
      style={dynamicWrapperStyles} // Apply dynamic transform and z-index
      className={`
        flex-shrink-0 
        w-44 h-64 md:w-52 md:h-72  // Book dimensions (mobile and desktop)
        mb-[-160px] md:mb-0      // Negative margin for mobile stacking, none for desktop
        md:-mr-10                // Negative right margin for desktop overlapping
        last:md:mr-0             // Remove negative margin for the last book on desktop
        relative                 
        transition-transform duration-300 ease-out // Smooth transition for transformations
      `}
    >
      {/* Main book clickable area */}
      <div
        className={`
            w-full h-full ${book.color} // Apply random color palette
            rounded-md shadow-lg cursor-pointer 
            border-2 ${book.borderColor} // Apply border color from palette
            flex flex-col justify-between p-0.5 // Inner padding and flex layout
            transition-shadow duration-300 ease-out // Smooth shadow transition
            hover:shadow-xl // Enhance shadow on hover
            ${
              isDesktop && !isSelected // Apply hover effects only if not selected and on desktop
                ? "md:hover:scale-[1.02] md:hover:-translate-y-1 md:hover:!rotate-0"
                : ""
            }
            ${
              !isDesktop && !isSelected // Apply hover effects only if not selected and on mobile
                ? "hover:scale-[1.02] hover:-translate-y-1 hover:!rotate-0"
                : ""
            }
            ${isSelected ? "shadow-2xl" : ""} // Stronger shadow when selected
        `}
        onClick={() => onBookClick(book.id, bookRef)} // Handle book selection
        role="button" // ARIA role for interactivity
        tabIndex={0} // Make it focusable
        onKeyPress={(e) => e.key === "Enter" && onBookClick(book.id, bookRef)} // Allow selection with Enter key
        aria-label={`Select book: ${book.title}`}
      >
        {/* Book Spine */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-6 md:w-8 ${book.spineColor} rounded-l-sm shadow-inner flex items-center justify-center z-0`}
        >
          <p
            className={`flex justify-items-stretch transform -rotate-90 origin-center whitespace-nowrap ${book.textColor} text-[9px] md:text-xs font-semibold tracking-wider uppercase`}
            style={{
              // Dynamically set width for rotated text to fit spine height
              width: `${
                (isDesktop ? bookBaseHeightDesktop : bookBaseHeightMobile) * 0.6
              }px`,
            }}>
              <div className="justify-self-start">
                {/* Truncate title on spine if too long */}
                {book.title.length > (isDesktop ? 18 : 15)
                  ? book.title.substring(0, isDesktop ? 16 : 13) + "..."
                  : book.title}
              </div>
          </p>
        </div>

        {/* Cover Content (right of the spine) */}
        <div
          className={`relative z-[5] ml-6 md:ml-8 flex flex-col h-full p-2 md:p-2.5 overflow-hidden ${coverPageEffect}`}
        >
          {/* Star Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the book click event from firing
              onToggleStar(book.id); // Call the toggle star handler
            }}
            className={`absolute top-2 right-2 p-1 rounded-full ${book.textColor} hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-white/60 z-10 transition-colors`}
            aria-label={isStarred ? `Unstar ${book.title}` : `Star ${book.title}`}
            title={isStarred ? `Unstar book` : `Star book`} // Tooltip for accessibility
          >
            {isStarred ? (
              // Filled star icon if starred
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434L10.788 3.21z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Outline star icon if not starred
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.518a.563.563 0 01.329.89l-4.462 3.242a.563.563 0 00-.192.518l1.6 5.171a.563.563 0 01-.84.61l-4.725-3.354a.563.563 0 00-.652 0l-4.725 3.354a.563.563 0 01-.84-.61l1.6-5.171a.563.563 0 00-.192-.518l-4.462-3.242a.563.563 0 01.329-.89h5.518a.563.563 0 00.475-.31L11.48 3.5z"
                />
              </svg>
            )}
          </button>

          {/* Book Title */}
          <h3
            className={`font-bold text-sm md:text-base ${book.textColor} leading-tight drop-shadow-sm mb-0.5 pr-8`} // Added pr-8 to prevent overlap with star button
          >
            {book.title}
          </h3>
          {/* Book Author */}
          <p
            className={`text-[9px] md:text-[10px] ${book.textColor} opacity-70 mb-1`}
          >
            by {book.author}
          </p>

          {/* Bottom section of the cover: Year and "Read Book" link */}
          <div className="mt-auto flex flex-col items-end space-y-1.5">
            {/* Publication Year Tag */}
            <span
              className={`px-1.5 py-0.5 text-[8px] md:text-[9px] font-semibold rounded-full ${book.tagColor} shadow-sm`}
            >
              {book.year}
            </span>
            {/* "Read Book" Link (visible only when selected) */}
            {isSelected && (
              <a
                href={`/book/${book.id}`} // Placeholder link
                onClick={(e) => e.stopPropagation()} // Prevent book click event from firing if link is clicked
                className={`inline-block text-[10px] md:text-xs px-2 md:px-2.5 py-1 ${book.tagColor} font-bold rounded shadow-md hover:opacity-80 transition-opacity`}
                aria-label={`Read more about ${book.title}`}
              >
                Read Book
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
function AutoCenterSelectedBookPage() {
  // State for raw book data fetched from the API
  const [rawBooks, setRawBooks] = useState([]);
  // State to track if data has been loaded
  const [isLoaded, setLoaded] = useState(false);
  // State for any errors during data fetching
  const [error, setError] = useState(null);
  // State for processed book data (with added color palette info, etc.)
  const [booksData, setBooksData] = useState([]);

  // State for books currently displayed (e.g., after search filtering)
  const [displayedBooks, setDisplayedBooks] = useState([]);
  // State for the active search term entered by the user
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  
  // State to store IDs of starred books using a Set for efficient add/delete/check
  const [starredBookIds, setStarredBookIds] = useState(new Set());

  // Effect to load books from the API on component mount
  useEffect(() => {
    const loadBooks = async () => {
      setLoaded(false); // Set loading state
      setError(null); // Reset error state
      try {
        const response = await api.get("/book"); // API call
        if (response.status === 200 && response.data.payload) {
          setRawBooks(response.data.payload); // Store fetched books
        } else {
          // Handle cases where API returns success but no payload, or other non-error statuses
          setRawBooks([]);
          setError("Could not retrieve books at this time.");
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        // Detailed error handling based on error type
        if (err.response) { // Server responded with an error status
          if (err.response.status === 404) {
            setError("No books found in the collection.");
          } else {
            setError(
              `Server error: ${err.response.status}. Please try again later.`
            );
          }
        } else if (err.request) { // Request was made but no response received
          setError("Network error. Please check your connection.");
        } else { // Other errors (e.g., setup issues)
          setError("An unexpected error occurred while fetching books.");
        }
        setRawBooks([]); // Ensure rawBooks is empty on error
      } finally {
        setLoaded(true); // Set loaded state to true regardless of outcome
      }
    };

    loadBooks();
  }, []); // Empty dependency array: run only once on mount

  // Effect to process rawBooks into booksData when rawBooks, isLoaded, or error changes
  useEffect(() => {
    // Guard: Don't process if not loaded or if rawBooks is empty (unless it's an error case where rawBooks is empty after loading)
    if (!isLoaded || rawBooks.length === 0) {
      if (isLoaded && rawBooks.length === 0 && !error) {
        // Case: Loaded, no books, no error (e.g., empty collection)
        setBooksData([]);
        setDisplayedBooks([]); // Also clear displayed books
      }
      return;
    }

    // Helper function to transform raw book data into the format needed for the Book component
    const getBookData = (book) => {
      const randomIndex = Math.floor(Math.random() * colorPalettes.length);
      const selectedPalette = colorPalettes[randomIndex];

      return {
        id: book._id, // Use _id as id
        title: book.title,
        author: book.author.name, // Assuming author is an object with a name property
        color: selectedPalette.color,
        borderColor: selectedPalette.borderColor,
        textColor: selectedPalette.textColor,
        spineColor: selectedPalette.spineColor,
        year: book.publishedYear,
        tagColor: selectedPalette.tagColor,
        slug: `#book-${book._id}`, // For potential deep linking or accessibility
      };
    };

    const newBooksData = rawBooks.map(getBookData);
    setBooksData(newBooksData);
    // Note: displayedBooks will be set by SearchBar's onSearchResults or an initial setup
    // If no search bar, you might want to setDisplayedBooks(newBooksData) here initially.
  }, [rawBooks, isLoaded, error]); // Dependencies: re-run if these change

  // State for the ID of the currently selected book
  const [selectedBookId, setSelectedBookId] = useState(null);
  // State to track if the screen size is desktop (>= 768px)
  const [isDesktop, setIsDesktop] = useState(true);
  // Ref to store references to each Book component's DOM element
  const bookRefs = useRef({}); // Object to map book.id to its ref

  // Effect to check screen size on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize); // Add resize listener
    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup listener
  }, []); // Empty dependency array: run only once on mount

  // Callback to handle book click: selects/deselects a book and scrolls it into view
  const handleBookClick = useCallback(
    (bookId, bookElementRef) => {
      // Toggle selection: if already selected, deselect (null), otherwise select bookId
      const newSelectedId = selectedBookId === bookId ? null : bookId;
      setSelectedBookId(newSelectedId);

      // If a book is newly selected and its ref exists, scroll it into view
      if (newSelectedId && bookElementRef && bookElementRef.current) {
        setTimeout(() => { // Timeout to allow UI updates before scrolling
          bookElementRef.current.scrollIntoView({
            behavior: "smooth", // Smooth scroll
            block: isDesktop ? "nearest" : "center", // Vertical alignment
            inline: isDesktop ? "center" : "nearest", // Horizontal alignment
          });
        }, 50); // Small delay
      }
    },
    [selectedBookId, isDesktop] // Dependencies: re-create if selectedBookId or isDesktop changes
  );

  // Callback to deselect the currently selected book
  const deselectBook = useCallback(() => {
    setSelectedBookId(null);
  }, []); // No dependencies, always the same function

  // Callback for toggling a book's star status
  const handleToggleStar = useCallback((bookId) => {
    setStarredBookIds(prevStarredIds => {
      const newStarredIds = new Set(prevStarredIds); // Create a new Set from the previous state
      if (newStarredIds.has(bookId)) {
        newStarredIds.delete(bookId); // Unstar
      } else {
        newStarredIds.add(bookId); // Star
      }
      // console.log("Starred IDs:", newStarredIds); // For debugging
      return newStarredIds; // Return the new Set to update state
    });
  }, []); // No dependencies, this function's logic doesn't change

  // Memoized details of the selected book
  const selectedBookDetails = useMemo(
    () => booksData.find((b) => b.id === selectedBookId),
    [booksData, selectedBookId] // Recalculate if booksData or selectedBookId changes
  );

  // Effect to handle clicks outside of a selected book to deselect it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If a book is selected and the click is not on an interactive element (button, link, input, star button)
      if (
        selectedBookId !== null &&
        !event.target.closest( // Check if click target or its ancestors match these selectors
          '[role="button"], [aria-label^="Close"], [aria-label^="Read more"], input[type="text"], [aria-label^="Star"], [aria-label^="Unstar"]'
        )
      ) {
        deselectBook(); // Deselect the book
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // Add listener
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup listener
  }, [selectedBookId, deselectBook]); // Dependencies: re-add listener if selectedBookId or deselectBook changes

  // Callback to handle search results from the SearchBar component
  const handleSearchResults = useCallback((results, term) => {
    setDisplayedBooks(results); // Update displayed books with search results
    setActiveSearchTerm(term); // Store the search term
    // If a book was selected but is no longer in the search results, deselect it
    if (selectedBookId && !results.find(book => book.id === selectedBookId)) {
      deselectBook();
    }
  }, [selectedBookId, deselectBook]); // Dependencies: selectedBookId & deselectBook ensure correct deselection behavior

  // Constants for desktop layout calculations (e.g., padding around book container)
  const desktopBookPopUpHeight = 48; // How much a selected book "pops up"
  const desktopContainerVerticalPadding = desktopBookPopUpHeight + 20; // Padding to accommodate the pop-up

  // Conditional rendering for loading state
  if (!isLoaded && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        Loading books...
      </div>
    );
  }
  // Conditional rendering for error state when no books could be loaded
  if (error && booksData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-center px-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-0 overflow-x-hidden text-slate-100">
      {/* Page Header */}
      <header className="w-full text-center py-8 sm:py-10 shrink-0 px-4">
        <h1 className="text-3xl pb-2 sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-2 sm:mb-3">
          The Scholar's Auto-Centering Shelf
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {/* Dynamically show selected book title or a general message */}
          {selectedBookId && selectedBookDetails ? (
            <>
              Selected:{" "}
              <span className="font-semibold text-sky-300">
                {selectedBookDetails.title}
              </span>
              .
            </>
          ) : (
            "Explore the collection. Click a book to select it or search below."
          )}
        </p>
      </header>

      {/* Search Bar */}
      <SearchBar
        dataSource={booksData} // Provide all processed books to search from
        searchKeys={['title', 'author', 'year']} // Specify which book properties to search
        onSearchResults={handleSearchResults} // Callback for when search results are available
        placeholder="Search books by title or author..."
        ariaLabel="Search books"
      />

      {/* Main Content Area for displaying books */}
      <main className="flex-grow flex flex-col items-center justify-center w-full px-2 sm:px-4">
        {/* Display error message if an error occurred but some data might still be shown */}
        {error && booksData.length > 0 && (
          <p className="text-red-400 mb-4 text-center">
            {error} (Showing available data)
          </p>
        )}

        {/* Message when no books are displayed (either empty collection or no search results) */}
        {displayedBooks.length === 0 && isLoaded && !error && (
          <p className="text-slate-400 py-10">
            {activeSearchTerm
              ? `No books found matching "${activeSearchTerm}".`
              : "No books available in the collection."}
          </p>
        )}
        {/* Render the list of books if there are books to display */}
        {displayedBooks.length > 0 && (
          <div
            className={`
              relative 
              flex 
              ${
                isDesktop // Layout changes based on screen size
                  ? "flex-row items-end overflow-x-auto overflow-y-visible custom-scrollbar px-8 max-w-6xl" // Desktop: horizontal scroll, items aligned to bottom
                  : "flex-col items-center justify-center pt-10 pb-5 w-full" // Mobile: vertical stack
              } 
            `}
            style={
              isDesktop // Apply dynamic padding for desktop to accommodate book pop-up
                ? {
                    paddingTop: `${desktopContainerVerticalPadding}px`,
                    paddingBottom: `${desktopContainerVerticalPadding}px`,
                  }
                : {}
            }
          >
            {/* Map over displayedBooks to render each Book component */}
            {displayedBooks.map((book) => {
              // Ensure a ref is created for each book (if not already)
              if (!bookRefs.current[book.id]) {
                bookRefs.current[book.id] = React.createRef();
              }
              return (
                <Book
                  key={book.id}
                  book={book}
                  onBookClick={handleBookClick}
                  isSelected={selectedBookId === book.id}
                  isDesktop={isDesktop}
                  bookRef={bookRefs.current[book.id]} // Pass the ref to the Book component
                  isStarred={starredBookIds.has(book.id)} // Pass starred status
                  onToggleStar={handleToggleStar} // Pass toggle star callback
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Page Footer */}
      <footer className="w-full text-center py-6 shrink-0 px-4">
        <p className="text-xs sm:text-sm text-slate-400">
          © {new Date().getFullYear()} Your Learning Platform.
        </p>
      </footer>
    </div>
  );
}

export default AutoCenterSelectedBookPage;