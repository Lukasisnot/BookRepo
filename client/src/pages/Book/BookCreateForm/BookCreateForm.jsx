import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // axios instance

export default function BookCreateForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    publishedYear: "",
  });
  const [authors, setAuthors] = useState([]);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  // Fetch authors for dropdown
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.get("/author");
        setAuthors(response.data.payload || []);
      } catch (err) {
        setInfo("Failed to load authors.");
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
    try {
      const response = await api.post("/book", {
        ...formData,
        publishedYear: Number(formData.publishedYear),
      });
      if (response.status === 201) {
        navigate(`/createdbook/${response.data.payload._id}`);
      } else {
        setInfo(response.data.msg || "Unknown error.");
      }
    } catch (error) {
      if (error.response) {
        setInfo(error.response.data.msg || "Server error.");
      } else {
        setInfo("Network error.");
      }
    }
  };

  return (
    <>
      <h1>Create Book</h1>
      <form onSubmit={handlePost}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
        <input
          type="number"
          name="publishedYear"
          placeholder="Published Year"
          value={formData.publishedYear}
          onChange={handleChange}
          required
        />

        <select
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>

        <button type="submit">Create Book</button>
      </form>

      {info && <p style={{ color: "red" }}>{info}</p>}
      <Link to="/">
        <p>Go back</p>
      </Link>
    </>
  );
}
