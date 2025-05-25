import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";


const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <svg className="animate-spin h-12 w-12 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-slate-300 text-lg">Loading Book Details...</p>
  </div>
);


const InfoMessageDisplay = ({ title, message, isError = true }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className={`max-w-md p-8 rounded-lg shadow-xl ${isError ? 'bg-red-900/50 border border-red-700' : 'bg-slate-800/70'}`}>
      <h2 className={`text-2xl font-semibold mb-3 ${isError ? 'text-red-300' : 'text-sky-400'}`}>{title}</h2>
      <p className={`${isError ? 'text-red-400' : 'text-slate-300'}`}>{message}</p>
      <Link
        to="/" 
        className="mt-6 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all"
      >
        Go to Library
      </Link>
    </div>
  </div>
);


const DetailItem = ({ label, value, isHtml = false, className = "", valueClassName = "text-slate-200" }) => {
  if (!value && value !== 0) return null;
  return (
    <div className={`py-2 ${className}`}>
      <span className="text-sm font-semibold text-slate-400 block mb-0.5">{label}</span>
      {isHtml ? (
        <div className={`${valueClassName} prose prose-sm prose-invert max-w-none whitespace-pre-wrap leading-relaxed`} dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <p className={`${valueClassName} whitespace-pre-wrap leading-relaxed`}>{value || "-"}</p>
      )}
    </div>
  );
};


export default function BookView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loadingState, setLoadingState] = useState('loading'); 
  const [errorMessage, setErrorMessage] = useState('');
  
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteInfo, setDeleteInfo] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      setLoadingState('loading');
      setErrorMessage('');
      try {
        const response = await api.get(`/book/${id}`);
        if (response.status === 200 && response.data.payload) {
          setBook(response.data.payload);
          setLoadingState('loaded');
        } else {
          setBook(null);
          setLoadingState('notfound');
          setErrorMessage('Book data could not be retrieved as expected.');
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
        setBook(null);
        if (error.response && error.response.status === 404) {
          setLoadingState('notfound');
          setErrorMessage('The requested book does not exist in our records.');
        } else {
          setLoadingState('error');
          setErrorMessage('Failed to fetch book details. Please try again later.');
        }
      }
    };
    if (id) {
      loadBook();
    }
  }, [id]);

  const handleDeleteChange = (e) => setDeleteConfirmText(e.target.value);

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (isDeleting) return;

    if (deleteConfirmText === book.title) {
      setIsDeleting(true);
      setDeleteInfo("");
      try {
        const response = await api.delete(`/book/${id}`);
        if (response.status === 200 || response.status === 204) { 
          navigate("/"); 
        } else {
          setDeleteInfo(response.data?.msg || "Failed to delete the book. Please try again.");
        }
      } catch (err) {
        setDeleteInfo(err.response?.data?.msg || "An error occurred while deleting the book.");
      } finally {
        setIsDeleting(false);
      }
    } else {
      setDeleteInfo("Incorrect title entered. Deletion canceled. Please type the book title exactly as shown.");
    }
  };

 
  if (loadingState === 'loading') {
    return (
      <>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
          <LoadingSpinner />
        </div>
      </>
    );
  }
  if (loadingState === 'notfound' || loadingState === 'error') {
    return (
      <>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
          <InfoMessageDisplay 
            title={loadingState === 'notfound' ? "Book Not Found" : "Error"}
            message={errorMessage}
            isError={loadingState === 'error'}
          />
        </div>
      </>
    );
  }
  if (!book) { 
     return (
      <>
       
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
          <InfoMessageDisplay title="Information Unavailable" message="Book details cannot be displayed at this time." />
        </div>
      </>
    );
  }

  const author = book.author; 
  const group = author?.literary_group;
  const period = author?.period;

  return (
    <>
     
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
        <div className="pt-20 sm:pt-24"> {}
          
          <header className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 break-words">
              {book.title}
            </h1>
            {author?.name && (
              <p className="mt-2 text-lg text-slate-400">by {author.name}</p>
            )}
          </header>

          <div className="max-w-3xl mx-auto bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            {}
            <section>
              <h2 className="text-2xl font-semibold text-sky-300 mb-4 border-b border-slate-700 pb-2">Book Information</h2>
              <DetailItem label="Synopsis / Description" value={book.description || "No description provided."} />
              <DetailItem label="Published Year" value={book.publishedYear} />
              <DetailItem label="Book ID" value={book._id} valueClassName="text-xs text-slate-500 font-mono" />
            </section>

            {}
            {author && (
              <section>
                <h2 className="text-2xl font-semibold text-sky-300 mb-4 border-b border-slate-700 pb-2">Author Details</h2>
                <DetailItem label="Name" value={author.name} />
                <DetailItem label="Nationality" value={author.nationality} />
                <DetailItem label="Biography" value={author.bio || "No biography available."} />

                {}
                {group && (
                  <div className="mt-4 pl-4 border-l-2 border-slate-700">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">Literary Group</h3>
                    <DetailItem label="Name" value={group.name} />
                    <DetailItem label="Years Active" value={group.years} />
                    <DetailItem label="Key Characteristics" value={group.characteristics} />
                  </div>
                )}

                {}
                {period && (
                  <div className="mt-4 pl-4 border-l-2 border-slate-700">
                    <h3 className="text-lg font-semibold text-sky-400 mb-2">Literary Period</h3>
                    <DetailItem label="Name" value={period.name} />
                    <DetailItem label="Years Active" value={period.years} />
                    <DetailItem label="Key Characteristics" Lvalue={period.characteristics} />
                  </div>
                )}
              </section>
            )}
            {!author && (
                <p className="text-slate-400 italic">No author information linked to this book.</p>
            )}


            {}
            <section className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
              <Link
                to={`/updatebook/${id}`}
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Update Book
              </Link>
              <Link
                to="/" 
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow-md transition-colors"
              >
                Back to Library
              </Link>
            </section>

            {}
            <section className="pt-6 border-t border-slate-700">
              <h2 className="text-xl font-semibold text-red-400 mb-3">Delete This Book</h2>
              <p className="text-sm text-slate-400 mb-4">
                To permanently delete this book, please type its full title: <strong className="text-slate-200">{book.title}</strong> in the box below and click delete. This action cannot be undone.
              </p>
              <form onSubmit={handleDeleteSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Type full book title to confirm deletion"
                  value={deleteConfirmText}
                  onChange={handleDeleteChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isDeleting}
                  className={`w-full sm:w-auto px-6 py-2.5 font-semibold rounded-lg shadow-md transition-all ${
                    isDeleting 
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500'
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete Book Permanently"}
                </button>
                {deleteInfo && <p className="text-sm font-medium text-red-400 pt-2">{deleteInfo}</p>}
              </form>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}

