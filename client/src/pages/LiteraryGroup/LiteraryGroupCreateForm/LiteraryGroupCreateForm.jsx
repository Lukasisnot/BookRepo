import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../api"; // axios instance

export default function LiteraryGroupCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    years: "",
    characteristics: "",
    members: "",
  });
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setInfo(null);
    try {
      const response = await api.post("/literary-group", formData);
      if (response.status === 201 && response.data.payload) {
        navigate(`/createdliterary-group/${response.data.payload._id}`);
      } else {
        setInfo(response.data.msg || "Unknown error");
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        setInfo(error.response.data.msg);
      } else if (error.request) {
        setInfo("Network error. Please check your connection.");
      } else {
        setInfo("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 py-12 sm:px-6 lg:px-8 antialiased">
      <div className="w-full max-w-xl bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-8 sm:mb-10 text-center">
          Create Literary Group
        </h1>

        <form onSubmit={handlePost} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Enter literary group name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="years" className="block text-sm font-medium text-slate-300 mb-1.5">
              Years
            </label>
            <input
              type="text"
              name="years"
              id="years"
              placeholder="e.g., 1500-1600"
              value={formData.years}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="characteristics" className="block text-sm font-medium text-slate-300 mb-1.5">
              Characteristics
            </label>
            <input
              type="text"
              name="characteristics"
              id="characteristics"
              placeholder="Short description"
              value={formData.characteristics}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="members" className="block text-sm font-medium text-slate-300 mb-1.5">
              Members
            </label>
            <input
              type="text"
              name="members"
              id="members"
              placeholder="List of members"
              value={formData.members}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full font-semibold py-2.5 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400"
          >
            Create Literary Group
          </button>
        </form>

        {info && (
          <p className="mt-6 text-sm text-center font-medium text-red-400">
            {info}
          </p>
        )}

        <Link
          to="/"
          className="block mt-8 text-center text-sky-400 hover:text-sky-300 text-sm transition-colors"
        >
          ← Back to Shelf
        </Link>
      </div>
    </div>
  );
}
