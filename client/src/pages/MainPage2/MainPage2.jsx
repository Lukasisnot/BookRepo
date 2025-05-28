import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import api from "../../api";

// Color palettes for the books
const colorPalettes = [
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
  }
];


// ... (Book component remains the same) ...
const Book = ({ book, onBookClick, isSelected, isDesktop, bookRef }) => {
  // ... existing Book component code ...
  const bookBaseHeightMobile = 260;
  const bookBaseHeightDesktop = 300;

 
  const baseRandomFactor = useMemo(() => {
    return Math.random() - 0.5;
  }, [book.id]); 

  
  const randomTiltDeg = useMemo(() => {
   
    const tiltMultiplier = isDesktop ? 15 : 5; 
    return baseRandomFactor * tiltMultiplier;
  }, [baseRandomFactor, isDesktop]); 

  const dynamicWrapperStyles = useMemo(() => {
    let transformValue = `rotate(${randomTiltDeg}deg)`;
    let zIndexValue = 10; 

    if (isSelected) {
      zIndexValue = 40;
      if (isDesktop) {
        transformValue = `translateY(-48px) scale(1.1) rotate(0deg)`; 
      } else {
        transformValue = `translateY(-20px) scale(1.05) rotate(0deg)`;
      }
    }
    
    return {
      transform: transformValue,
      zIndex: zIndexValue,
      willChange: 'transform, z-index',
    };
  }, [isSelected, isDesktop, randomTiltDeg]); 

  const coverPageEffect = "before:content-[''] before:absolute before:inset-y-0 before:right-0 before:w-[3px] before:bg-white/10 before:rounded-r-sm before:opacity-70";

  return (
    <div
      ref={bookRef} 
      style={dynamicWrapperStyles}
      className={`
        flex-shrink-0 
        w-44 h-64 md:w-52 md:h-72
        mb-[-160px] md:mb-0      
        md:-mr-10                
        last:md:mr-0            
        relative                 
        transition-transform duration-300 ease-out 
      `}
    >
      <div
        className={`
            w-full h-full ${book.color}
            rounded-md shadow-lg cursor-pointer 
            border-2 ${book.borderColor}
            flex flex-col justify-between p-0.5 
            transition-shadow duration-300 ease-out 
            hover:shadow-xl 
            ${isDesktop && !isSelected ? 'md:hover:scale-[1.02] md:hover:-translate-y-1 md:hover:!rotate-0' : ''}
            ${!isDesktop && !isSelected ? 'hover:scale-[1.02] hover:-translate-y-1 hover:!rotate-0' : ''}
            ${isSelected ? 'shadow-2xl' : ''}
        `}
        onClick={() => onBookClick(book.id, bookRef)} 
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onBookClick(book.id, bookRef)}
        aria-label={`Select book: ${book.title}`}
      >
        {/* Spine */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-6 md:w-8 ${book.spineColor} rounded-l-sm shadow-inner flex items-center justify-center z-0`}
        >
          <p 
            className={`transform -rotate-90 origin-center whitespace-nowrap ${book.textColor} text-[9px] md:text-xs font-semibold tracking-wider uppercase`}
            style={{ width: `${(isDesktop ? bookBaseHeightDesktop : bookBaseHeightMobile) * 0.6}px` }}
          >
            {book.title.length > (isDesktop ? 18 : 15) ? book.title.substring(0, (isDesktop ? 16 : 13)) + "..." : book.title}
          </p>
        </div>

        {/* Cover Content */}
        <div className={`relative z-[5] ml-6 md:ml-8 flex flex-col h-full p-2 md:p-2.5 overflow-hidden ${coverPageEffect}`}>
          <h3 className={`font-bold text-sm md:text-base ${book.textColor} leading-tight drop-shadow-sm mb-0.5`}>{book.title}</h3>
          <p className={`text-[9px] md:text-[10px] ${book.textColor} opacity-70 mb-1`}>by {book.author}</p>
          
          <div className="mt-auto flex flex-col items-end space-y-1.5">
              <span className={`px-1.5 py-0.5 text-[8px] md:text-[9px] font-semibold rounded-full ${book.tagColor} shadow-sm`}>
                  {book.tag}
              </span>
              {isSelected && (
                   <a
                      href={book.slug}
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
  
  const [books, setBooks] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [error, setError] = useState(null); 
  const [booksData, setBooksData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

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
  
  useEffect(() => {
    const loadBooksData = () => { 
      if (!isLoaded || books.length === 0) { 
        if (isLoaded && books.length === 0 && !error) { 
            setBooksData([]);
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
          tag: book.publishedYear, 
          tagColor: selectedPalette.tagColor, 
          slug: `#book-${book._id}` 
        };
      };

      const newBooksData = books.map(getBookData); 
      setBooksData(newBooksData);
    };
    
    loadBooksData();
  }, [books, isLoaded, error]); 

  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true); 
  const bookRefs = useRef({}); 

  useEffect(() => {
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize(); 
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleBookClick = useCallback((bookId, bookElementRef) => {
    const newSelectedId = selectedBookId === bookId ? null : bookId; 
    setSelectedBookId(newSelectedId);

    if (newSelectedId && bookElementRef && bookElementRef.current) {
      setTimeout(() => { 
        bookElementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: isDesktop ? 'nearest' : 'center', 
          inline: isDesktop ? 'center' : 'nearest'  
        });
      }, 50); 
    }
  }, [selectedBookId, isDesktop]);

  const deselectBook = useCallback(() => {
    setSelectedBookId(null);
  }, []);
  
  const selectedBookDetails = useMemo(() => booksData.find(b => b.id === selectedBookId), [booksData, selectedBookId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedBookId !== null && !event.target.closest('[role="button"], [aria-label^="Close"], [aria-label^="Read more"], input[type="text"]')) {
        deselectBook();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedBookId, deselectBook]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedBookId(null); // Deselect book when search term changes
  };

  const filteredBooksData = useMemo(() => {
    if (!searchTerm) {
      return booksData;
    }
    return booksData.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [booksData, searchTerm]);


  const desktopBookPopUpHeight = 48; 
  const desktopContainerVerticalPadding = desktopBookPopUpHeight + 20; 

  if (!isLoaded && !error) {
    return <div className="min-h-screen flex items-center justify-center text-slate-100">Loading books...</div>;
  }
  if (error && booksData.length === 0) { // Show error only if no books data to fallback to
    return <div className="min-h-screen flex items-center justify-center text-red-400 text-center px-4">{error}</div>;
  }


  return (
    <div className="min-h-screen flex flex-col px-0 overflow-x-hidden text-slate-100">
      <header className="w-full text-center py-8 sm:py-10 shrink-0 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-2 sm:mb-3">
          The Scholar's Auto-Centering Shelf
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {selectedBookId && selectedBookDetails ? 
            <>Selected: <span className="font-semibold text-sky-300">{selectedBookDetails.title}</span>.</> :
            "Explore the collection. Click a book to select it or search below."
          }
        </p>
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-lg mx-auto mb-6 sm:mb-8 px-4">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-3 text-sm border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-700 text-slate-100 placeholder-slate-400 outline-none transition-colors"
          aria-label="Search books"
        />
      </div>


      {selectedBookId && (
        <button
            onClick={deselectBook}
            aria-label="Close selected book view"
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[101] bg-slate-700/80 hover:bg-slate-600/90 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-colors backdrop-blur-sm text-sm"
        >
            Close
        </button>
      )}

      <main className="flex-grow flex flex-col items-center justify-center w-full px-2 sm:px-4">
        {/* Display error here as well if it persists but some books might be loaded */}
        {error && booksData.length > 0 && (
             <p className="text-red-400 mb-4 text-center">{error} (Showing cached/previous data if available)</p>
        )}

        {filteredBooksData.length === 0 && isLoaded && !error && (
            <p className="text-slate-400 py-10">
              {searchTerm 
                ? `No books found matching "${searchTerm}".` 
                : "No books available in the collection."
              }
            </p>
        )}
        {filteredBooksData.length > 0 && (
          <div
            className={`
              relative 
              flex 
              ${isDesktop 
                  ? 'flex-row items-end overflow-x-auto overflow-y-visible custom-scrollbar px-8 max-w-6xl' 
                  : 'flex-col items-center justify-center pt-10 pb-5 w-full'
              } 
            `}
            style={isDesktop ? { 
              paddingTop: `${desktopContainerVerticalPadding}px`, 
              paddingBottom: `${desktopContainerVerticalPadding}px` 
            } : {}}
          >
            {filteredBooksData.map((book) => {
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
                />
              );
            })}
          </div>
        )}
      </main>

      <footer className="w-full text-center py-6 shrink-0 px-4">
        <p className="text-xs sm:text-sm text-slate-400">© {new Date().getFullYear()} Your Learning Platform.</p>
      </footer>
    </div>
  );
}

export default AutoCenterSelectedBookPage;