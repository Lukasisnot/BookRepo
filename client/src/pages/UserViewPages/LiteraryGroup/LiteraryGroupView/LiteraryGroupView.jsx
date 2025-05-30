import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [literaryGroup, setLiteraryGroup] = useState(null);
  const [loadingState, setLoadingState] = useState("loading"); // loading, loaded, notfound, error
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteInfo, setDeleteInfo] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadLiteraryGroup = async () => {
      setLoadingState("loading");
      setErrorMessage("");
      try {
        const response = await api.get(`/literary-groupuser/${id}`);
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

  
  if (loadingState === "loading") {
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
        <InfoMessageDisplay title="Information Unavailable" message="Literary group details cannot be displayed at this time." />
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

          

          
        </div>
      </div>
    </div>
  );
}
