import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../../../api";

const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <svg
      className="animate-spin h-12 w-12 text-sky-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="mt-4 text-slate-300 text-lg">Loading Literary Group...</p>
  </div>
);

const InfoMessageDisplay = ({ title, message, isError = true }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div
      className={`max-w-md p-8 rounded-lg shadow-xl ${
        isError ? "bg-red-900/50 border border-red-700" : "bg-slate-800/70"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-3 ${
          isError ? "text-red-300" : "text-sky-400"
        }`}
      >
        {title}
      </h2>
      <p className={`${isError ? "text-red-400" : "text-slate-300"}`}>
        {message}
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all"
      >
        Go to Library
      </Link>
    </div>
  </div>
);

const DetailItem = ({
  label,
  value,
  isHtml = false,
  className = "",
  valueClassName = "text-slate-200",
}) => {
  if (!value && value !== 0) return null;
  return (
    <div className={`py-2 ${className}`}>
      <span className="text-sm font-semibold text-slate-400 block mb-0.5">
        {label}
      </span>
      {isHtml ? (
        <div
          className={`${valueClassName} prose prose-sm prose-invert max-w-none whitespace-pre-wrap leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <p className={`${valueClassName} whitespace-pre-wrap leading-relaxed`}>
          {value || "-"}
        </p>
      )}
    </div>
  );
};

export default function LiteraryGroupView() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUserSession = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await api.get("/user/me");
      if (response.status === 200 && response.data.payload) {
        setUser(response.data.payload);
        localStorage.setItem("isUserLoggedIn", "true");
      } else {
        setUser(null);
        localStorage.removeItem("isUserLoggedIn");
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("isUserLoggedIn");
      if (err.response && err.response.status !== 401) {
        setAuthError(err.response?.data?.error || "Failed to fetch user session.");
      }
      console.log("No active session or error fetching user:", err.message);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  const { id } = useParams();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const [literaryGroup, setLiteraryGroup] = useState(null);
  const [loadingState, setLoadingState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteInfo, setDeleteInfo] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadLiteraryGroup = async () => {
      setLoadingState("loading");
      setErrorMessage("");
      try {
        const response = await api.get(`/literary-group/${id}`);
        if (response.status === 200 && response.data.payload) {
          setLiteraryGroup(response.data.payload);
          setLoadingState("loaded");
        } else {
          setLiteraryGroup(null);
          setLoadingState("notfound");
          setErrorMessage("Literary group data could not be retrieved.");
        }
      } catch (error) {
        setLiteraryGroup(null);
        if (error.response && error.response.status === 404) {
          setLoadingState("notfound");
          setErrorMessage("The requested literary group does not exist.");
        } else {
          setLoadingState("error");
          setErrorMessage("Failed to fetch literary group details. Please try again later.");
        }
      }
    };
    if (id) {
      loadLiteraryGroup();
    }
  }, [id]);

  const handleDeleteChange = (e) => setDeleteConfirmText(e.target.value);

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (isDeleting) return;

    if (deleteConfirmText === literaryGroup.name) {
      setIsDeleting(true);
      setDeleteInfo("");
      try {
        const response = await api.delete(`/literary-group/${id}`);
        if (response.status === 200 || response.status === 204) {
          navigate("/");
        } else {
          setDeleteInfo(response.data?.msg || "Failed to delete the literary group. Please try again.");
        }
      } catch (err) {
        setDeleteInfo(err.response?.data?.msg || "An error occurred while deleting the literary group.");
      } finally {
        setIsDeleting(false);
      }
    } else {
      setDeleteInfo("Incorrect name entered. Deletion canceled. Please type the literary group name exactly as shown.");
    }
  };

  if (loadingState === "loading" || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
        <LoadingSpinner />
      </div>
    );
  }

  if (loadingState === "notfound" || loadingState === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
        <InfoMessageDisplay
          title={loadingState === "notfound" ? "Literary Group Not Found" : "Error"}
          message={errorMessage}
          isError={loadingState === "error"}
        />
      </div>
    );
  }

  if (!literaryGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
        <InfoMessageDisplay
          title="Information Unavailable"
          message="Literary group details cannot be displayed at this time."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100 px-4 pb-12 antialiased">
      <div className="pt-20 sm:pt-24 max-w-3xl mx-auto">
        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 break-words">
            {literaryGroup.name}
          </h1>
        </header>

        <div className="bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-sky-300 mb-4 border-b border-slate-700 pb-2">
              Literary Group Information
            </h2>
            <DetailItem label="Name" value={literaryGroup.name} />
            <DetailItem label="Years Active" value={literaryGroup.years || "-"} />
            <DetailItem label="Key Characteristics" value={literaryGroup.characteristics || "-"} />
          </section>

          {isAdmin && (
            <section className="pt-6 border-t border-slate-700">
              <h2 className="text-xl font-semibold text-red-400 mb-3">Delete This Literary Group</h2>
              <p className="text-sm text-slate-400 mb-4">
                To permanently delete this literary group, please type its full name:{" "}
                <strong className="text-slate-200">{literaryGroup.name}</strong> in the box below and click delete. This action cannot be undone.
              </p>
              <form onSubmit={handleDeleteSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Type full literary group name to confirm deletion"
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
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Delete Literary Group Permanently"}
                </button>
                {deleteInfo && <p className="text-sm font-medium text-red-400 pt-2">{deleteInfo}</p>}
              </form>
            </section>
          )}

          <section className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
            {isAdmin && (
              <Link
                to={`/updateliterary-group/${id}`}
                className="w-full sm:w-auto text-center px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Update Literary Group
              </Link>
            )}
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
