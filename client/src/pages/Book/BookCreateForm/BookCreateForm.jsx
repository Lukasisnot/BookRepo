import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; 

export default function BookCreateForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "", 
    publishedYear: "",
  });
  const [authors, setAuthors] = useState([]);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.get("/author"); 
        setAuthors(response.data.payload || []);
      } catch (err) {
        console.error("Failed to load authors:", err);
        setInfo("Failed to load authors. Please try again later.");
      }
    };
    fetchAuthors();
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
      const payload = {
        ...formData,
        publishedYear: Number(formData.publishedYear),
      };
      

      const response = await api.post("/book", payload); 

      if (response.status === 201 && response.data.payload) {
        navigate(`/createdbook/${response.data.payload._id}`); 
      } else {
        setInfo(response.data.msg || "An unknown error occurred while creating the book.");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      if (error.response && error.response.data && error.response.data.msg) {
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 mb-8 sm:mb-10 text-center">
          Add a New Book
        </h1>

        <form onSubmit={handlePost} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1.5">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="e.g., The Cosmic Labyrinth"
              value={formData.title}
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
              name="description"
              id="description"
              placeholder="A brief summary of the book..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="publishedYear" className="block text-sm font-medium text-slate-300 mb-1.5">
              Published Year
            </label>
            <input
              type="number"
              name="publishedYear"
              id="publishedYear"
              placeholder="e.g., 2023"
              value={formData.publishedYear}
              onChange={handleChange}
              required
              min="0"
              max={new Date().getFullYear() + 5} 
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-slate-300 mb-1.5">
              Author
            </label>
            <select
              name="author"
              id="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors appearance-none"
              
            >
              <option value="" disabled className="text-slate-500">Select an Author</option>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <option key={author._id} value={author._id} className="bg-slate-800 text-slate-100">
                    {author.name}
                  </option>
                ))
              ) : (
                <option value="" disabled className="text-slate-500">Loading authors...</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2.5 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out
                        ${isLoading 
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400'
                        }`}
          >
            {isLoading ? "Creating..." : "Create Book"}
          </button>
        </form>

        {info && (
          <p className={`mt-6 text-sm text-center font-medium ${info.toLowerCase().includes('failed') || info.toLowerCase().includes('error') ? 'text-red-400' : 'text-green-400'}`}>
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