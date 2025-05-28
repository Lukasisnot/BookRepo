import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../api"; // axios instance

export default function PeriodCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    characteristics: "",
    years: "",
  });
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setInfo(null);

    try {
      const response = await api.post("/period", formData);
      if (response.status === 201 && response.data.payload) {
        navigate(`/createdperiod/${response.data.payload._id}`);
      } else {
        setInfo(response.data.msg || "An unknown error occurred while creating the period.");
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        setInfo(error.response.data.msg);
      } else if (error.request) {
        setInfo("Network error. Please check your connection.");
      } else {
        setInfo("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 py-12 sm:px-6 lg:px-8 antialiased">
      <div className="w-full max-w-xl bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 mb-8 sm:mb-10 text-center">
          Add a New Literary Period
        </h1>

        <form onSubmit={handlePost} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Period Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="e.g., Renaissance"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="characteristics" className="block text-sm font-medium text-slate-300 mb-1.5">
              Characteristics
            </label>
            <textarea
              name="characteristics"
              id="characteristics"
              placeholder="Brief description of the period..."
              value={formData.characteristics}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="years" className="block text-sm font-medium text-slate-300 mb-1.5">
              Years (e.g., 1500-1600)
            </label>
            <input
              type="text"
              name="years"
              id="years"
              placeholder="e.g., 1500-1600"
              value={formData.years}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2.5 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out
              ${isLoading
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-600 hover:to-sky-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400'
              }`}
          >
            {isLoading ? "Creating..." : "Create Period"}
          </button>
        </form>

        {info && (
          <p className={`mt-6 text-sm text-center font-medium ${info.toLowerCase().includes('error') || info.toLowerCase().includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
            {info}
          </p>
        )}

        <Link
          to="/"
          className="block mt-8 text-center text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
        >
          ← Back to Shelf
        </Link>
      </div>
    </div>
  );
}
