import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function LiteraryGroupView() {
  const { id } = useParams();
  const [LiteraryGroup, setLiteraryGroup] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const response = await api.get(`/literary-group/${id}`);
      if (response.status === 200) {
        setLiteraryGroup(response.data.payload);
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
    if (formData === LiteraryGroup.name) {
      try {
        const response = await api.delete(`/literary-group/${id}`);
        if (response.status === 200) {
          navigate("/");
        } else {
          setInfo(response.data.msg || "Failed to delete");
        }
      } catch {
        setInfo("Failed to delete");
      }
    } else {
      setInfo("Incorrect name. Please type the LiteraryGroup name exactly.");
    }
  };

  if (isLoaded === null) return <p>LiteraryGroup not found.</p>;
  if (!isLoaded) return <p>Loading LiteraryGroup...</p>;

  return (
    <>
      <h1>LiteraryGroup Details</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Name:</strong> {LiteraryGroup.name}</p>
      <p><strong>Years:</strong> {LiteraryGroup.years || "-"}</p>
      <p><strong>Characteristics:</strong> {LiteraryGroup.characteristics || "-"}</p>
      

      <form onSubmit={handleDelete}>
        <p>To delete, type the LiteraryGroup name: <strong>{LiteraryGroup.name}</strong></p>
        <input
          type="text"
          placeholder="Type LiteraryGroup name to confirm"
          onChange={handleChange}
          value={formData}
        />
        <button type="submit">Delete</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>

      <Link to={`/updateliterary-group/${id}`}>
        <p>Update LiteraryGroup</p>
      </Link>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
