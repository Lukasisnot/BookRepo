import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function AuthorUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nationality: "",
    literary_group: "",
    period: "",
  });

  const [literaryGroups, setLiteraryGroups] = useState([]);
  const [periods, setPeriods] = useState([]);

  // Load author data
  useEffect(() => {
    async function load() {
      try {
        const [authorRes, groupsRes, periodsRes] = await Promise.all([
          api.get(`/author/${id}`),
          api.get("/literary-group"),
          api.get("/period"),
        ]);

        if (authorRes.status === 200) {
          const fetchedAuthor = authorRes.data.payload;
          setAuthor(fetchedAuthor);
          setFormData({
            name: fetchedAuthor.name || "",
            bio: fetchedAuthor.bio || "",
            nationality: fetchedAuthor.nationality || "",
            literary_group: fetchedAuthor.literary_group?._id || "",
            period: fetchedAuthor.period?._id || "",
          });
          setLoaded(true);
        } else {
          setLoaded(null);
        }

        if (groupsRes.status === 200) setLiteraryGroups(groupsRes.data.payload);
        if (periodsRes.status === 200) setPeriods(periodsRes.data.payload);
      } catch (error) {
        console.error(error);
        setLoaded(null);
      }
    }
    load();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo(null);
    try {
      const response = await api.put(`/author/${id}`, formData);
      if (response.status === 200) {
        navigate(`/author/${id}`);
      } else {
        setInfo(response.data.msg || "Update failed.");
      }
    } catch (error) {
      setInfo("Error while updating the author.");
      console.error(error);
    }
  };

  if (isLoaded === null) return <p>Author not found.</p>;
  if (!isLoaded) return <p>Loading author data...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 p-6">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-lg text-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Update Author</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter author name"
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1 font-semibold">
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short biography"
              rows={4}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block mb-1 font-semibold">
              Nationality
            </label>
            <input
              id="nationality"
              name="nationality"
              type="text"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nationality"
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="literary_group" className="block mb-1 font-semibold">
              Literary Group
            </label>
            <select
              id="literary_group"
              name="literary_group"
              value={formData.literary_group}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- None --</option>
              {literaryGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="period" className="block mb-1 font-semibold">
              Period
            </label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select Period --</option>
              {periods.map((period) => (
                <option key={period._id} value={period._id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          {info && (
            <p className="text-center text-red-400 font-medium">{info}</p>
          )}

          <div className="flex justify-between items-center">
            <Link to="/" className="text-indigo-400 hover:underline">
              Go back
            </Link>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              Update Author
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
