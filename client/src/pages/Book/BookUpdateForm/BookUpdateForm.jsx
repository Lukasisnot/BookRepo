import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function BookUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    publishedYear: "",
  });

  const [authors, setAuthors] = useState([]);
  const [info, setInfo] = useState(null);
  const [isLoaded, setLoaded] = useState(false);

  // Load the current book
  const loadBook = async () => {
    try {
      const res = await api.get(`/book/${id}`);
      if (res.status === 200) {
        const book = res.data.payload;
        setFormData({
          title: book.title || "",
          description: book.description || "",
          author: book.author?._id || "",
          publishedYear: book.publishedYear || "",
        });
        setLoaded(true);
      }
    } catch (error) {
      console.error("Error loading book:", error);
      setLoaded(null);
    }
  };

  // Load authors for the dropdown
  const loadAuthors = async () => {
    try {
      const res = await api.get("/author");
      if (res.status === 200) setAuthors(res.data.payload);
    } catch (err) {
      console.error("Failed to load authors:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/book/${id}`, formData);
      if (res.status === 200) {
        navigate(`/book/${id}`);
      } else {
        setInfo(res.data.msg || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating book:", err);
      setInfo("Server error while updating.");
    }
  };

  useEffect(() => {
    loadBook();
    loadAuthors();
  }, [id]);

  if (isLoaded === null) return <p>Book not found.</p>;
  if (!isLoaded) return <p>Loading book...</p>;

  return (
    <>
      <h1>Update Book</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          required
          placeholder="Book title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          required
          placeholder="Book description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />

        <label>Author</label>
        <select
          name="author"
          value={formData.author}
          required
          onChange={handleChange}
        >
          <option value="">-- Select Author --</option>
          {authors.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="publishedYear"
          required
          placeholder="Published Year"
          value={formData.publishedYear}
          onChange={handleChange}
        />

        <button type="submit">Update Book</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>

      <Link to="/">
        <p>Go back</p>
      </Link>
    </>
  );
}
