
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';


const initialBooksData = [
  { id: 1, title: "The Alchemist's Code", author: "Nova Script", color: "bg-rose-600", borderColor: "border-rose-800", textColor: "text-yellow-100", spineColor: "bg-rose-800", tag: "Fantasy", tagColor: "bg-yellow-400 text-rose-800", slug: "#alchemists-code" },
  { id: 2, title: "Cosmic Cartography", author: "Stella Voyager", color: "bg-sky-600", borderColor: "border-sky-800", textColor: "text-slate-100", spineColor: "bg-sky-800", tag: "Sci-Fi", tagColor: "bg-cyan-300 text-sky-800", slug: "#cosmic-cartography" },
  { id: 3, title: "Whispers of Old Woods", author: "Sylas Evergreen", color: "bg-emerald-600", borderColor: "border-emerald-800", textColor: "text-lime-100", spineColor: "bg-emerald-800", tag: "Nature", tagColor: "bg-lime-300 text-emerald-800", slug: "#whispers-old-woods" },
  { id: 4, title: "Quantum Explained", author: "Dr. Axiom Fields", color: "bg-violet-600", borderColor: "border-violet-800", textColor: "text-pink-100", spineColor: "bg-violet-800", tag: "Physics", tagColor: "bg-pink-300 text-violet-800", slug: "#quantum-entanglement" },
  { id: 5, title: "Ancient Civilizations", author: "Historia Relic", color: "bg-amber-600", borderColor: "border-amber-800", textColor: "text-stone-100", spineColor: "bg-amber-800", tag: "History", tagColor: "bg-stone-300 text-amber-800", slug: "#ancient-civilizations" },
  { id: 6, title: "The Art of Logic", author: "Ratio Nalis", color: "bg-gray-600", borderColor: "border-gray-800", textColor: "text-cyan-100", spineColor: "bg-gray-800", tag: "Philosophy", tagColor: "bg-cyan-300 text-gray-800", slug: "#art-of-logic" },
  { id: 7, title: "Culinary Journeys", author: "Gastronome Epic", color: "bg-orange-600", borderColor: "border-orange-800", textColor: "text-yellow-100", spineColor: "bg-orange-800", tag: "Cooking", tagColor: "bg-yellow-300 text-orange-800", slug: "#culinary-journeys" },
  { id: 8, title: "Stellar Mechanics", author: "Celestia Astra", color: "bg-indigo-600", borderColor: "border-indigo-800", textColor: "text-purple-100", spineColor: "bg-indigo-800", tag: "Astronomy", tagColor: "bg-purple-300 text-indigo-800", slug: "#stellar-mechanics" }
];


const Book = ({ book, onBookClick, isSelected, isDesktop, bookRef }) => {
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
  const [booksData] = useState(initialBooksData);
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

    if (newSelectedId && bookElementRef && bookElementRef.current && isDesktop) {
     
      setTimeout(() => { 
        bookElementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', 
          inline: 'center'  
        });
      }, 50); 
    } else if (newSelectedId && bookElementRef && bookElementRef.current && !isDesktop) {
       
        setTimeout(() => {
            bookElementRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center', 
                inline: 'nearest' 
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
      if (selectedBookId !== null && !event.target.closest('[role="button"], [aria-label^="Close"], [aria-label^="Read more"]')) {
        deselectBook();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedBookId, deselectBook]);

  const desktopBookPopUpHeight = 48; 
  const desktopContainerVerticalPadding = desktopBookPopUpHeight + 20; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 flex flex-col px-0 overflow-x-hidden antialiased">
      <header className="w-full text-center py-8 sm:py-10 shrink-0 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-2 sm:mb-3">
          The Scholar's Auto-Centering Shelf
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {selectedBookId && selectedBookDetails ? 
            <>Selected: <span className="font-semibold text-sky-300">{selectedBookDetails.title}</span>.</> :
            "Explore the collection. Click a book to select it."
          }
        </p>
      </header>

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
        <div
          className={`
            relative 
            flex 
            ${isDesktop 
                ? 'flex-row items-end overflow-x-auto overflow-y-visible custom-scrollbar px-8 max-w-6xl' 
                : 'flex-col items-center justify-center pt-10 pb-5'
            } 
          `}
          style={isDesktop ? { 
            paddingTop: `${desktopContainerVerticalPadding}px`, 
            paddingBottom: `${desktopContainerVerticalPadding}px` 
          } : {}}
        >
          {booksData.map((book) => {
         
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
      </main>

      <footer className="w-full text-center py-6 shrink-0 px-4">
        <p className="text-xs sm:text-sm text-slate-400">© {new Date().getFullYear()} Your Learning Platform.</p>
      </footer>
    </div>
  );
}

export default AutoCenterSelectedBookPage;

