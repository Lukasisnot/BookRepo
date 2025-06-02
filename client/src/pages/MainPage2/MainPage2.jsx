import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import api from "../../api"; // Assumed API client for fetching data
import SearchBar from "../../components/SearchBar"; // Reusable SearchBar component

// Color palettes (remains unchanged)
const colorPalettes = [
  // ... (color palettes as provided)
  {
    name: "Rose/Yellow",
    color: "bg-rose-600",
    borderColor: "border-rose-800",
    textColor: "text-yellow-100",
    spineColor: "bg-rose-800",
    tagColor: "bg-yellow-400 text-rose-800",
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

// Book Component
const Book = ({
  book,
  onBookClick,
  isSelected,
  isDesktop,
  bookRef,
  isStarred,
  onToggleStar,
  animationIndex,
}) => {
  const bookBaseHeightMobile = 260;
  const bookBaseHeightDesktop = 300;

  const baseRandomFactor = useMemo(() => {
    return Math.random() - 0.5;
  }, [book.id]);

  const randomTiltDeg = useMemo(() => {
    const tiltMultiplier = isDesktop ? 10 : 4;
    return baseRandomFactor * tiltMultiplier;
  }, [baseRandomFactor, isDesktop]);

  const [isReadyToAnimateIn, setIsReadyToAnimateIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [allowInteractionDelay, setAllowInteractionDelay] = useState(true);

  useEffect(() => {
    const entranceTimer = setTimeout(() => {
      setIsReadyToAnimateIn(true);
    }, 50); // Initial delay before starting any animation

    const thisBookStaggerDelay = animationIndex * 75;
    const transitionDuration = 300; // Duration from className for transform/opacity
    const initialRenderDelay = 50; // The 50ms timeout before setting isReadyToAnimateIn

    // Delay to allow entrance animation to mostly complete before removing individual stagger
    // for subsequent interactions (hover, select).
    const interactionDelayTimer = setTimeout(() => {
      setAllowInteractionDelay(false);
    }, initialRenderDelay + thisBookStaggerDelay + transitionDuration + 100);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(interactionDelayTimer);
    };
  }, [animationIndex]);

  const dynamicWrapperStyles = useMemo(() => {
    // Entrance animation parameters (equivalent to original Tailwind: translate-y-12, scale-95)
    const entranceTranslateYInitial = 48; // px (3rem, assuming 1rem = 16px)
    const entranceScaleInitial = 0.95;

    let translateY, scale, rotate, currentOpacity, zIndexValue;

    if (!isReadyToAnimateIn) {
      // Initial state: "before" animation (slid down, scaled down, tilted, transparent)
      translateY = entranceTranslateYInitial;
      scale = entranceScaleInitial;
      rotate = randomTiltDeg; // Apply initial tilt from the start
      currentOpacity = 0;
      zIndexValue = 5; // Lower z-index while hidden/animating in
    } else {
      // "After" animation state or interactive states
      currentOpacity = 1;

      // Base "animated-in" state (not hovered, not selected)
      translateY = 0;
      scale = 1.0;
      rotate = randomTiltDeg;
      zIndexValue = 10; // Default z-index

      // Apply hover effects if active and not selected
      if (isHovered && !isSelected) {
        translateY = -8;    // Hover: slight lift
        scale = 1.03;       // Hover: slight scale up
        // rotate remains randomTiltDeg
        zIndexValue = 30;   // Higher z-index on hover
      }

      // Apply selected effects (these override hover effects if also selected)
      if (isSelected) {
        translateY = isDesktop ? -48 : -20; // Selected: significant lift
        scale = isDesktop ? 1.1 : 1.05;    // Selected: significant scale up
        rotate = 0;                         // Selected: straighten out
        zIndexValue = 40;                   // Highest z-index when selected
      }
    }

    const transformValue = `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`;

    return {
      transform: transformValue,
      opacity: currentOpacity,
      zIndex: zIndexValue,
      willChange: "transform, opacity", // Hint for browser optimization
      // Stagger delay for the entrance animation. Set to 0ms after entrance.
      transitionDelay: allowInteractionDelay ? `${animationIndex * 75}ms` : "0ms",
    };
  }, [
    isReadyToAnimateIn, // Crucial new dependency
    isSelected,
    isDesktop,
    randomTiltDeg,
    animationIndex,
    isHovered,
    allowInteractionDelay,
  ]);

  const coverPageEffect =
    "before:content-[''] before:absolute before:inset-y-0 before:right-0 before:w-[3px] before:bg-white/10 before:rounded-r-sm before:opacity-70";

  return (
    <div
      ref={bookRef}
      style={dynamicWrapperStyles}
      className={`
        isolate
        flex-shrink-0
        w-44 h-64 md:w-52 md:h-72
        mb-[-160px] md:mb-0
        md:-mr-10
        last:md:mr-0
        relative
        transition-[transform,opacity] duration-300 ease-out
        ${/* Entrance animation classes for transform/opacity are now handled by dynamicWrapperStyles */''}
      `}
      onMouseEnter={() => !allowInteractionDelay && setIsHovered(true)} // Delay hover until initial animation pass
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
            w-full h-full ${book.color}
            rounded-md shadow-lg cursor-pointer
            border-2 ${book.borderColor}
            flex flex-col justify-between p-0.5
            transition-shadow duration-300 ease-out
            hover:shadow-xl
            ${isSelected ? "shadow-2xl" : ""}
        `}
        onClick={() => onBookClick(book.id, bookRef)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === "Enter" && onBookClick(book.id, bookRef)}
        aria-label={`Select book: ${book.title}`}
      >
        {/* Spine */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-6 md:w-8 ${book.spineColor} rounded-l-sm shadow-inner flex items-center justify-center z-0`}
        >
          <p
            className={`flex justify-items-stretch transform -rotate-90 origin-center whitespace-nowrap ${book.textColor} text-[9px] md:text-xs font-semibold tracking-wider uppercase`}
            style={{
              width: `${
                (isDesktop ? bookBaseHeightDesktop : bookBaseHeightMobile) * 0.6
              }px`,
            }}
          >
            <span className="justify-self-start truncate">
              {book.title}
            </span>
          </p>
        </div>

        {/* Cover Content */}
        <div
          className={`relative z-[5] ml-6 md:ml-8 flex flex-col h-full p-2 md:p-2.5 overflow-hidden ${coverPageEffect}`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(book.id);
            }}
            className={`absolute top-2 right-2 p-1 rounded-full ${book.textColor} hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-white/60 z-10 transition-colors`}
            aria-label={isStarred ? `Unstar ${book.title}` : `Star ${book.title}`}
            title={isStarred ? `Unstar book` : `Star book`}
          >
            {isStarred ? (
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

          <h3
            className={`font-bold text-sm md:text-base ${book.textColor} leading-tight drop-shadow-sm mb-0.5 pr-8`}
          >
            {book.title}
          </h3>
          <p
            className={`text-[9px] md:text-[10px] ${book.textColor} opacity-70 mb-1`}
          >
            by {book.author}
          </p>

          <div className="mt-auto flex flex-col items-end space-y-1.5">
            <span
              className={`px-1.5 py-0.5 text-[8px] md:text-[9px] font-semibold rounded-full ${book.tagColor} shadow-sm`}
            >
              {book.year}
            </span>
            {isSelected && (
              <a
                href={`/book/${book.id}`}
                onClick={(e) => e.stopPropagation()}
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
  const [rawBooks, setRawBooks] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [booksData, setBooksData] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  
  const [starredBookIds, setStarredBookIds] = useState(new Set());
  const [starringError, setStarringError] = useState(null); 

  useEffect(() => {
    const loadBooks = async () => {
      setLoaded(false);
      setError(null);
      try {
        const response = await api.get("/book");
        if (response.status === 200 && response.data.payload) {
          setRawBooks(response.data.payload);
        } else {
          setRawBooks([]);
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
        setRawBooks([]);
      } finally {
        setLoaded(true);
      }
    };
    loadBooks();
  }, []);

  useEffect(() => {
    if (!isLoaded || rawBooks.length === 0) {
      if (isLoaded && rawBooks.length === 0 && !error) {
        setBooksData([]);
        setDisplayedBooks([]);
      }
      return;
    }
    const getBookData = (book) => {
      const randomIndex = Math.floor(Math.random() * colorPalettes.length);
      const selectedPalette = colorPalettes[randomIndex];
      return {
        id: book._id,
        title: book.title,
        author: book.author.name,
        color: selectedPalette.color,
        borderColor: selectedPalette.borderColor,
        textColor: selectedPalette.textColor,
        spineColor: selectedPalette.spineColor,
        year: book.publishedYear,
        tagColor: selectedPalette.tagColor,
        slug: `#book-${book._id}`,
      };
    };
    const newBooksData = rawBooks.map(getBookData);
    setBooksData(newBooksData);
  }, [rawBooks, isLoaded, error]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        const response = await api.get("/user/me/favorites");
        if (response.status === 200 && response.data.payload && response.data.payload.favoriteBooks) {
          const favoriteIds = new Set(response.data.payload.favoriteBooks.map(book => book._id));
          setStarredBookIds(favoriteIds);
        }
      } catch (err) {
        if (err.response && err.response.status !== 401) { // Don't show console error for 401
          console.error("Error fetching user favorites:", err);
        } else if (!err.response) {
          console.error("Network error fetching user favorites:", err);
        }
      }
    };
    if (isLoaded && booksData.length > 0) { // Only fetch if books are loaded
        fetchUserFavorites();
    }
  }, [isLoaded, booksData]);


  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const bookRefs = useRef({});

  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleBookClick = useCallback(
    (bookId, bookElementRef) => {
      const newSelectedId = selectedBookId === bookId ? null : bookId;
      setSelectedBookId(newSelectedId);
      if (newSelectedId && bookElementRef && bookElementRef.current) {
        setTimeout(() => {
          bookElementRef.current.scrollIntoView({
            behavior: "smooth",
            block: isDesktop ? "nearest" : "center",
            inline: isDesktop ? "center" : "nearest",
          });
        }, 50); // Delay to allow selection animation to start
      }
    },
    [selectedBookId, isDesktop]
  );

  const deselectBook = useCallback(() => {
    setSelectedBookId(null);
  }, []);

  const handleToggleStar = useCallback(async (bookId) => {
    setStarringError(null); 
    const isCurrentlyStarred = starredBookIds.has(bookId);
    const originalStarredBookIds = new Set(starredBookIds); 

    // Optimistically update UI
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
      setStarredBookIds(originalStarredBookIds); // Revert on error

      if (err.response) {
        if (err.response.status === 401) {
          setStarringError("Please log in to manage your favorite books.");
        } else {
          setStarringError(err.response.data.error || "Failed to update favorite status. Please try again.");
        }
      } else if (err.request) {
        setStarringError("Network error. Could not update favorite status.");
      } else {
        setStarringError("An unexpected error occurred.");
      }
    }
  }, [starredBookIds]); 

  const selectedBookDetails = useMemo(
    () => booksData.find((b) => b.id === selectedBookId),
    [booksData, selectedBookId]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedBookId !== null &&
        !event.target.closest(
          '[role="button"], [aria-label^="Close"], [aria-label^="Read more"], input[type="text"], [aria-label^="Star"], [aria-label^="Unstar"]'
        )
      ) {
        deselectBook();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedBookId, deselectBook]);

  const handleSearchResults = useCallback((results, term) => {
    setDisplayedBooks(results);
    setActiveSearchTerm(term);
    // If selected book is filtered out, deselect it
    if (selectedBookId && !results.find(book => book.id === selectedBookId)) {
      deselectBook();
    }
  }, [selectedBookId, deselectBook]);

  const desktopBookPopUpHeight = 48; // For selected book translateY
  const desktopContainerVerticalPadding = desktopBookPopUpHeight + 20; // Ensure space for popup

  if (!isLoaded && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        Loading books...
      </div>
    );
  }
  if (error && booksData.length === 0) { // Critical error, no data to show
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-center px-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-0 overflow-x-hidden text-slate-100">
      <header className="w-full text-center py-8 sm:py-10 shrink-0 px-4">
        <h1 className="text-3xl pb-2 sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-2 sm:mb-3">
          The Scholar's Auto-Centering Shelf
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
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

      <SearchBar
        dataSource={booksData}
        searchKeys={['title', 'author', 'year']}
        onSearchResults={handleSearchResults}
        placeholder="Search books by title or author..."
        ariaLabel="Search books"
      />


      <main className="flex-grow flex flex-col items-center justify-center w-full px-2 sm:px-4">
        {error && booksData.length > 0 && ( // Non-critical error, show data with message
          <p className="text-red-400 mb-4 text-center">
            {error} (Showing available data)
          </p>
        )}

        {displayedBooks.length === 0 && isLoaded && !error && (
          <p className="text-slate-400 py-10">
            {activeSearchTerm
              ? `No books found matching "${activeSearchTerm}".`
              : "No books available in the collection."}
          </p>
        )}
        {displayedBooks.length > 0 && (
          <div
            className={`
              relative 
              flex 
              ${
                isDesktop
                  ? "flex-row items-end overflow-x-auto overflow-y-visible custom-scrollbar px-8 max-w-6xl"
                  : "flex-col items-center justify-center pt-10 pb-5 w-full"
              } 
            `}
            style={
              isDesktop
                ? {
                    paddingTop: `${desktopContainerVerticalPadding}px`,
                    paddingBottom: `${desktopContainerVerticalPadding}px`,
                  }
                : {}
            }
          >
            {displayedBooks.map((book, index) => { 
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
                  bookRef={bookRefs.current[book.id]}
                  isStarred={starredBookIds.has(book.id)}
                  onToggleStar={handleToggleStar}
                  animationIndex={index} 
                />
              );
            })}
          </div>
        )}
      </main>

      {starringError && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(220, 38, 38, 0.95)', 
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem', 
          }}
        >
          <span>{starringError}</span>
          <button 
            onClick={() => setStarringError(null)} 
            style={{
              marginLeft: '16px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem', 
              cursor: 'pointer',
              lineHeight: '1',
            }}
            aria-label="Dismiss error"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <footer className="w-full text-center py-6 shrink-0 px-4">
        <p className="text-xs sm:text-sm text-slate-400">
          © {new Date().getFullYear()} Your Learning Platform.
        </p>
      </footer>
    </div>
  );
}

export default AutoCenterSelectedBookPage;