import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // Adjust path to your API instance

export default function LiteraryGroupUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [literaryGroup, setLiteraryGroup] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Load literary group data
  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/literary-group/${id}`);
        if (response.status === 200 && response.data.payload) {
          const lg = response.data.payload;
          setLiteraryGroup(lg);
          setFormData({
            name: lg.name || "",
            description: lg.description || "",
          });
          setLoaded(true);
        } else {
          setLoaded(null);
        }
      } catch (error) {
        console.error("Error loading literary group:", error);
        setLoaded(null);
      }
    }
    load();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form data to update literary group
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo(null);
    try {
      const response = await api.put(`/literary-group/${id}`, formData);
      if (response.status === 200) {
        navigate(`/literary-group/${id}`);
      } else {
        setInfo(response.data.msg || "Failed to update literary group.");
      }
    } catch (error) {
      setInfo("An error occurred while updating.");
      console.error("Update error:", error);
    }
  };

  if (isLoaded === null) return <p>Literary group not found.</p>;
  if (!isLoaded) return <p>Loading literary group...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 px-4 py-12">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg p-8 shadow-lg text-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Update Literary Group</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter literary group name"
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={4}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {info && (
            <p className="text-center text-red-400 font-medium">{info}</p>
          )}

          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-indigo-400 hover:underline"
            >
              Go back
            </Link>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              Update Literary Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
