import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

// Reusable loading spinner
const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <svg
      className="animate-spin h-12 w-12 text-sky-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <p className="mt-4 text-slate-300 text-lg">Loading author...</p>
  </div>
);

// Info message component
const InfoMessageDisplay = ({ title, message }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className="max-w-md p-8 rounded-lg shadow-xl bg-red-900/50 border border-red-700">
      <h2 className="text-2xl font-semibold text-red-300 mb-3">{title}</h2>
      <p className="text-red-400">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all"
      >
        Go to Library
      </Link>
    </div>
  </div>
);

// Detail display
const DetailItem = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="py-2">
      <span className="text-sm font-semibold text-slate-400 block mb-0.5">{label}</span>
      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{value || "-"}</p>
    </div>
  );
};

export default function AuthorView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [status, setStatus] = useState("loading");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteInfo, setDeleteInfo] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/author/${id}`);
        if (response.status === 200) {
          setAuthor(response.data.payload);
          setStatus("loaded");
        } else {
          setStatus("notfound");
        }
      } catch {
        setStatus("error");
      }
    };
    load();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (isDeleting) return;

    if (deleteInput === author.name) {
      setIsDeleting(true);
      try {
        const response = await api.delete(`/author/${id}`);
        if (response.status === 200 || response.status === 204) {
          navigate("/");
        } else {
          setDeleteInfo(response.data?.msg || "Failed to delete the author.");
        }
      } catch {
        setDeleteInfo("An error occurred while deleting.");
      } finally {
        setIsDeleting(false);
      }
    } else {
      setDeleteInfo("Incorrect name. Please type the author name exactly.");
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-900 px-4"><LoadingSpinner /></div>;
  }

  if (status === "notfound" || status === "error") {
    return (
      <div className="min-h-screen bg-slate-900 px-4">
        <InfoMessageDisplay
          title={status === "notfound" ? "Author Not Found" : "Error"}
          message={
            status === "notfound"
              ? "The requested author could not be found."
              : "Failed to load the author. Please try again later."
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
      <div className="pt-20 sm:pt-24 max-w-3xl mx-auto">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500">
            {author.name}
          </h1>
        </header>

        <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-sky-300 mb-4 border-b border-slate-700 pb-2">Author Info</h2>
            <DetailItem label="Name" value={author.name} />
            <DetailItem label="Bio" value={author.bio} />
            <DetailItem label="Nationality" value={author.nationality} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-300 mb-3 border-b border-slate-700 pb-2">Literary Group</h2>
            {author.literary_group ? (
              <>
                <DetailItem label="Name" value={author.literary_group.name} />
                <DetailItem label="Years" value={author.literary_group.years} />
                <DetailItem label="Characteristics" value={author.literary_group.characteristics} />
              </>
            ) : (
              <p className="text-slate-400 italic">No literary group assigned.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-300 mb-3 border-b border-slate-700 pb-2">Period</h2>
            {author.period ? (
              <>
                <DetailItem label="Name" value={author.period.name} />
                <DetailItem label="Years" value={author.period.years} />
                <DetailItem label="Characteristics" value={author.period.characteristics} />
              </>
            ) : (
              <p className="text-slate-400 italic">No period assigned.</p>
            )}
          </section>

          <section className="pt-6 border-t border-slate-700">
            <h2 className="text-xl font-semibold text-red-400 mb-3">Delete This Author</h2>
            <p className="text-sm text-slate-400 mb-4">
              To permanently delete this author, type their full name:{" "}
              <strong className="text-slate-200">{author.name}</strong>
            </p>
            <form onSubmit={handleDelete} className="space-y-4">
              <input
                type="text"
                placeholder="Type full author name to confirm deletion"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isDeleting}
                className={`w-full sm:w-auto px-6 py-2.5 font-semibold rounded-lg shadow-md transition-all ${
                  isDeleting
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete Author Permanently"}
              </button>
              {deleteInfo && <p className="text-sm font-medium text-red-400 pt-2">{deleteInfo}</p>}
            </form>
          </section>

          <section className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
            <Link
              to={`/updateauthor/${id}`}
              className="w-full sm:w-auto text-center px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Update Author
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto text-center px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow-md transition-colors"
            >
              Back to Library
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
