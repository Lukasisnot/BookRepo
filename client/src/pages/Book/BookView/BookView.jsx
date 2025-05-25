import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function BookView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState("");
  const [info, setInfo] = useState();

  const load = async () => {
    try {
      const response = await api.get(`/book/${id}`);
      if (response.status === 200) {
        setBook(response.data.payload);
        setLoaded(true);
      } else {
        setLoaded(null);
      }
    } catch (error) {
      console.error("Failed to fetch book:", error);
      setLoaded(null);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleChange = (e) => setFormData(e.target.value);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (formData === book.title) {
      try {
        const response = await api.delete(`/book/${id}`);
        if (response.status === 200) {
          navigate("/");
        } else {
          setInfo(response.data.msg || "Failed to delete");
        }
      } catch {
        setInfo("Failed to delete");
      }
    } else {
      setInfo("Incorrect title. Please type the book title exactly.");
    }
  };

  if (isLoaded === null) return <p>Book not found.</p>;
  if (!isLoaded) return <p>Loading book...</p>;

  const author = book.author;
  const group = author?.literary_group;
  const period = author?.period;

  return (
    <>
      <h1>Book Details</h1>
      <p><strong>ID:</strong> {book._id}</p>
      <p><strong>Title:</strong> {book.title}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Published Year:</strong> {book.publishedYear}</p>

      <h2>Author Details</h2>
      {author ? (
        <>
          <p><strong>Name:</strong> {author.name}</p>
          <p><strong>Nationality:</strong> {author.nationality || "-"}</p>
          <p><strong>Bio:</strong> {author.bio}</p>

          <h3>Literary Group</h3>
          {group ? (
            <div>
              <p><strong>Name:</strong> {group.name}</p>
              <p><strong>Years:</strong> {group.years || "-"}</p>
              <p><strong>Characteristics:</strong> {group.characteristics || "-"}</p>
            </div>
          ) : (
            <p>-</p>
          )}

          <h3>Period</h3>
          {period ? (
            <div>
              <p><strong>Name:</strong> {period.name}</p>
              <p><strong>Years:</strong> {period.years || "-"}</p>
              <p><strong>Characteristics:</strong> {period.characteristics || "-"}</p>
            </div>
          ) : (
            <p>-</p>
          )}
        </>
      ) : (
        <p>No author information found.</p>
      )}

      <form onSubmit={handleDelete}>
        <p>To delete, type the book title: <strong>{book.title}</strong></p>
        <input
          type="text"
          placeholder="Type book title to confirm"
          onChange={handleChange}
          value={formData}
        />
        <button type="submit">Delete</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>

      <Link to={`/updatebook/${id}`}>
        <p>Update book</p>
      </Link>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
