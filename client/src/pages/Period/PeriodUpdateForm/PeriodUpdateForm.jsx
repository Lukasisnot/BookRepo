import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

const LoadingSpinner = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center">
    <svg className="animate-spin h-12 w-12 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-slate-300 text-lg">Loading Period Data...</p>
  </div>
);

const InfoMessageDisplay = ({ title, message, isError = true, showGoBackButton = true }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <div className={`max-w-md p-8 rounded-lg shadow-xl ${isError ? 'bg-red-900/50 border border-red-700' : 'bg-slate-800/70'}`}>
      <h2 className={`text-2xl font-semibold mb-3 ${isError ? 'text-red-300' : 'text-sky-400'}`}>{title}</h2>
      <p className={`${isError ? 'text-red-400' : 'text-slate-300'}`}>{message}</p>
      {showGoBackButton && (
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          Go to Home
        </Link>
      )}
    </div>
  </div>
);

export default function PeriodUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [pageState, setPageState] = useState("loading"); // loading | loaded | error | notfound
  const [info, setInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPeriod() {
      setPageState("loading");
      setInfo(null);
      try {
        const res = await api.get(`/period/${id}`);
        if (res.status === 200 && res.data.payload) {
          setFormData({
            name: res.data.payload.name || "",
            description: res.data.payload.description || "",
          });
          setPageState("loaded");
        } else {
          setPageState("notfound");
        }
      } catch (error) {
        console.error("Failed to load period:", error);
        setPageState("notfound");
      }
    }
    if (id) loadPeriod();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setInfo(null);

    try {
      const res = await api.put(`/period/${id}`, formData);
      if (res.status === 200) {
        navigate(`/period/${id}`);
      } else {
        setInfo(res.data?.msg || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setInfo(error.response?.data?.msg || "Server error while updating. Please try later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
        <LoadingSpinner />
      </div>
    );
  }

  if (pageState === "notfound" || pageState === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 antialiased">
        <InfoMessageDisplay
          title={pageState === "notfound" ? "Period Not Found" : "Error Loading Period"}
          message={pageState === "notfound" ? "The period you are trying to update was not found." : "An error occurred while loading the period."}
          isError={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 py-12 sm:px-6 lg:px-8 antialiased">
      <div className="w-full max-w-lg bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-8 sm:mb-10 text-center">
          Update Period "{formData.name || "Period"}"
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Period Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter period name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/period/${id}`)}
              className="w-full sm:w-auto order-2 sm:order-1 flex-1 text-center px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto order-1 sm:order-2 flex-1 font-semibold py-2.5 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out
                ${isSubmitting
                  ? 'bg-slate-500 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400'
                }`}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>

        {info && (
          <p className={`mt-6 text-sm text-center font-medium ${info.toLowerCase().includes('failed') || info.toLowerCase().includes('error') ? 'text-red-400' : 'text-green-400'}`}>
            {info}
          </p>
        )}
      </div>
    </div>
  );
}
