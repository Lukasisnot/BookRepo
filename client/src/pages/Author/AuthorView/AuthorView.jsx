// src/pages/Author/AuthorView/AuthorView.jsx
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // Your API instance

// --- Helper Components ---
const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <svg className="animate-spin h-12 w-12 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <p className="mt-4 text-slate-300 text-lg">Loading Author...</p>
  </div>
);

const InfoMessageDisplay = ({ title, message, isError = true, backLink = "/author", backLinkText = "Back to Authors" }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className={`max-w-md p-8 rounded-lg shadow-xl ${isError ? "bg-red-900/50 border border-red-700" : "bg-slate-800/70"}`}>
      <h2 className={`text-2xl font-semibold mb-3 ${isError ? "text-red-300" : "text-sky-400"}`}>{title}</h2>
      <p className={`${isError ? "text-red-400" : "text-slate-300"}`}>{message}</p>
      <Link to={backLink} className="mt-6 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all">
        {backLinkText}
      </Link>
    </div>
  </div>
);

const DetailItem = ({ label, value, isHtml = false, valueClassName = "text-slate-200" }) => {
  if (!value && value !== 0 && typeof value !== 'string') return null; // Allow empty strings
  return (
    <div className="py-2">
      <span className="text-sm font-semibold text-slate-400 block mb-0.5">{label}</span>
      {isHtml ? (
        <div className={`${valueClassName} prose prose-sm prose-invert max-w-none whitespace-pre-wrap leading-relaxed`} dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <p className={`${valueClassName} whitespace-pre-wrap leading-relaxed`}>{value === null || value === undefined ? "-" : value}</p>
      )}
    </div>
  );
};
// --- End of Helper Components ---

export default function AuthorView({ user }) { // Accept user prop
  console.log("[AuthorView] Component rendered. Received user prop:", user);

  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [status, setStatus] = useState("loading"); // Renamed from loadingState for consistency
  const [errorMessage, setErrorMessage] = useState(""); // Added for better error messages
  
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteInfo, setDeleteInfo] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    console.log("[AuthorView] useEffect for loadAuthor triggered. ID:", id);
    const loadAuthor = async () => {
      setStatus("loading");
      setErrorMessage("");
      try {
        console.log(`[AuthorView] Attempting to fetch /author/${id}`);
        const response = await api.get(`/author/${id}`);
        console.log(`[AuthorView] /author/${id} response status:`, response.status);
        if (response.status === 200 && response.data.payload) {
          setAuthor(response.data.payload);
          setStatus("loaded");
          console.log("[AuthorView] Author data loaded:", response.data.payload);
        } else {
          // Handle cases where payload might be missing even with 200 OK
          setAuthor(null);
          setStatus("notfound");
          setErrorMessage("Author data could not be retrieved as expected.");
          console.warn("[AuthorView] Author not found or bad response structure.");
        }
      } catch (error) {
        console.error("[AuthorView] Failed to fetch author:", error.response || error.message);
        setAuthor(null);
        if (error.response && error.response.status === 401) {
            console.error("[AuthorView] UNAUTHORIZED (401) fetching author. Check session/token.");
            setStatus("error");
            setErrorMessage("Unauthorized. You may need to log in again to view this content.");
        } else if (error.response && error.response.status === 404) {
          setStatus("notfound");
          setErrorMessage("The requested author does not exist in our records.");
        } else {
          setStatus("error");
          setErrorMessage("Failed to fetch author details. Please try again later.");
        }
      }
    };
    if (id) {
      loadAuthor();
    }
  }, [id]); // Dependency array includes 'id'

  const handleDelete = async (e) => { // Renamed from handleDeleteSubmit for clarity
    e.preventDefault();
    if (isDeleting || !author) return;

    if (deleteInput === author.name) {
      setIsDeleting(true);
      setDeleteInfo("");
      try {
        console.log(`[AuthorView] Attempting to delete /author/${id}`);
        const response = await api.delete(`/author/${id}`);
        console.log(`[AuthorView] Delete /author/${id} response status:`, response.status);
        if (response.status === 200 || response.status === 204) {
          navigate("/author"); // Navigate to authors list
        } else {
          setDeleteInfo(response.data?.msg || "Failed to delete the author. Please try again.");
        }
      } catch (err) {
        console.error("[AuthorView] Error deleting author:", err.response || err.message);
        setDeleteInfo(err.response?.data?.msg || "An error occurred while deleting the author.");
      } finally {
        setIsDeleting(false);
      }
    } else {
      setDeleteInfo("Incorrect name. Please type the author name exactly as shown to confirm deletion.");
    }
  };
 
  const isAdmin = user && user.role === 'admin';
  console.log("[AuthorView] isAdmin value:", isAdmin);
  if(user) {
    console.log("[AuthorView] user.role from prop:", user.role);
  }


  if (status === "loading") {
    return <div className="min-h-screen bg-slate-900 px-4"><LoadingSpinner /></div>;
  }
  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-900 px-4">
        <InfoMessageDisplay title="Error" message={errorMessage} isError={true} backLink="/author" backLinkText="Back to Authors"/>
      </div>
    );
  }
  if (status === "notfound" || !author) { // Combine notfound and !author check
    return (
      <div className="min-h-screen bg-slate-900 px-4">
        <InfoMessageDisplay
          title="Author Not Found"
          message={errorMessage || "The requested author could not be found."}
          isError={false} // Not necessarily an error, just not found
          backLink="/author"
          backLinkText="Back to Authors"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
      <div className="pt-20 sm:pt-24 max-w-3xl mx-auto">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 break-words">
            {author.name}
          </h1>
        </header>

        <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-sky-300 mb-4 border-b border-slate-700 pb-2">Author Information</h2>
            <DetailItem label="Name" value={author.name} />
            <DetailItem label="Biography" value={author.bio} />
            <DetailItem label="Nationality" value={author.nationality} />
            <DetailItem label="Author ID" value={author._id} valueClassName="text-xs text-slate-500 font-mono" />
          </section>

          {author.literary_group && (
            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-3 border-b border-slate-700 pb-2">Literary Group</h2>
              <DetailItem label="Name" value={author.literary_group.name} />
              <DetailItem label="Years Active" value={author.literary_group.years} />
              <DetailItem label="Key Characteristics" value={author.literary_group.characteristics} />
            </section>
          )}
          {!author.literary_group && (
             <p className="text-slate-400 italic py-2">No literary group assigned to this author.</p>
          )}

          {author.period && (
            <section>
              <h2 className="text-xl font-semibold text-indigo-300 mb-3 border-b border-slate-700 pb-2">Literary Period</h2>
              <DetailItem label="Name" value={author.period.name} />
              <DetailItem label="Years Active" value={author.period.years} />
              <DetailItem label="Key Characteristics" value={author.period.characteristics} />
            </section>
          )}
          {!author.period && (
            <p className="text-slate-400 italic py-2">No literary period assigned to this author.</p>
          )}

          {/* Admin Controls: Update Button and Delete Section */}
          {/* These sections are now wrapped with isAdmin check */}
          
          {isAdmin && (
            <section className="pt-6 border-t border-slate-700">
              <h2 className="text-xl font-semibold text-red-400 mb-3">Delete This Author</h2>
              <p className="text-sm text-slate-400 mb-4">
                To permanently delete this author, type their full name:{" "}
                <strong className="text-slate-200">{author.name}</strong> in the box below and click delete.
              </p>
              <form onSubmit={handleDelete} className="space-y-4">
                <input
                  type="text"
                  placeholder="Type full author name to confirm deletion"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isDeleting}
                  className={`w-full sm:w-auto px-6 py-2.5 font-semibold rounded-lg shadow-md transition-all ${
                    isDeleting
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete Author Permanently"}
                </button>
                {deleteInfo && <p className="text-sm font-medium text-red-400 pt-2">{deleteInfo}</p>}
              </form>
            </section>
          )}

          <section className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
            {isAdmin && ( // Update button also admin-only
              <Link
                to={`/updateauthor/${id}`} // Ensure this route exists and is protected
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Update Author
              </Link>
            )}
            <Link
              to="/author" // Link to the authors list
              className="w-full sm:w-auto text-center px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow-md transition-colors"
            >
              Back to Authors
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}