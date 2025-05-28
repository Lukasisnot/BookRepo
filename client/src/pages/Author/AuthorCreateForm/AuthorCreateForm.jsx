import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // axios instance

export default function AuthorCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nationality: "",
    literary_group: "",
    period: "",
  });
  const [info, setInfo] = useState(null);
  const [literaryGroups, setLiteraryGroups] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lgRes, periodRes] = await Promise.all([
          api.get("/literary-group"),
          api.get("/period"),
        ]);
        setLiteraryGroups(lgRes.data.payload || []);
        setPeriods(periodRes.data.payload || []);
      } catch (err) {
        setInfo("Failed to load groups or periods.");
      }
    };

    fetchData();
  }, []);

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
      const response = await api.post("/author", formData);
      if (response.status === 201 && response.data.payload) {
        navigate(`/createdauthor/${response.data.payload._id}`);
      } else {
        setInfo(response.data.msg || "An unknown error occurred.");
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-8 sm:mb-10 text-center">
          Add a New Author
        </h1>

        <form onSubmit={handlePost} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="e.g., Franz Kafka"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-slate-300 mb-1.5">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              id="nationality"
              placeholder="e.g., Czech"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1.5">
              Biography
            </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Brief biography..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="literary_group" className="block text-sm font-medium text-slate-300 mb-1.5">
              Literary Group (optional)
            </label>
            <select
              name="literary_group"
              id="literary_group"
              value={formData.literary_group}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
            >
              <option value="" className="text-slate-500">Select Literary Group</option>
              {literaryGroups.map((group) => (
                <option key={group._id} value={group._id} className="bg-slate-800 text-slate-100">
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium text-slate-300 mb-1.5">
              Literary Period
            </label>
            <select
  name="period"
  required
  value={formData.period}
  onChange={handleChange}
  className="w-full px-4 py-2.5 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
>
  <option value="">Select Literary Period</option>
  {periods.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2.5 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out
              ${isLoading
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-yellow-400'
              }`}
          >
            {isLoading ? "Creating..." : "Create Author"}
          </button>
        </form>

        {info && (
          <p className={`mt-6 text-sm text-center font-medium ${info.toLowerCase().includes('error') || info.toLowerCase().includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
            {info}
          </p>
        )}

        <Link
          to="/"
          className="block mt-8 text-center text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
        >
          ← Back to Shelf
        </Link>
      </div>
    </div>
  );
}
