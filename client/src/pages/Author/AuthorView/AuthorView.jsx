import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function AuthorView() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const response = await api.get(`/author/${id}`);
      if (response.status === 200) {
        setAuthor(response.data.payload);
        setLoaded(true);
      } else if (response.status === 404) {
        setLoaded(null);
      }
    } catch (error) {
      setLoaded(null);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleChange = (e) => setFormData(e.target.value);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (formData === author.name) {
      try {
        const response = await api.delete(`/author/${id}`);
        if (response.status === 200) {
          navigate("/");
        } else {
          setInfo(response.data.msg || "Failed to delete");
        }
      } catch {
        setInfo("Failed to delete");
      }
    } else {
      setInfo("Incorrect name. Please type the author name exactly.");
    }
  };

  if (isLoaded === null) return <p>Author not found.</p>;
  if (!isLoaded) return <p>Loading author...</p>;

  return (
    <>
      <h1>Author Details</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Name:</strong> {author.name}</p>
      <p><strong>Bio:</strong> {author.bio}</p>
      <p><strong>Nationality:</strong> {author.nationality}</p>

      <h2>Literary Group Details</h2>
      {author.literary_group ? (
        <div>
          <p><strong>Name:</strong> {author.literary_group.name}</p>
          <p><strong>Years:</strong> {author.literary_group.years || "-"}</p>
          <p><strong>Characteristics:</strong> {author.literary_group.characteristics || "-"}</p>
        </div>
      ) : (
        <p>-</p>
      )}

      <h2>Period Details</h2>
      {author.period ? (
        <div>
          <p><strong>Name:</strong> {author.period.name}</p>
          <p><strong>Years:</strong> {author.period.years || "-"}</p>
          <p><strong>Characteristics:</strong> {author.period.characteristics || "-"}</p>
        </div>
      ) : (
        <p>-</p>
      )}

      <form onSubmit={handleDelete}>
        <p>To delete, type the author's name: <strong>{author.name}</strong></p>
        <input
          type="text"
          placeholder="Type author name to confirm"
          onChange={handleChange}
          value={formData}
        />
        <button type="submit">Delete</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>

      <Link to={`/updateauthor/${id}`}>
        <p>Update author</p>
      </Link>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
