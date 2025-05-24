import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function PeriodView() {
  const { id } = useParams();
  const [period, setPeriod] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const response = await api.get(`/period/${id}`);
      if (response.status === 200) {
        setPeriod(response.data.payload);
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
    if (formData === period.name) {
      try {
        const response = await api.delete(`/period/${id}`);
        if (response.status === 200) {
          navigate("/");
        } else {
          setInfo(response.data.msg || "Failed to delete");
        }
      } catch {
        setInfo("Failed to delete");
      }
    } else {
      setInfo("Incorrect name. Please type the period name exactly.");
    }
  };

  if (isLoaded === null) return <p>Period not found.</p>;
  if (!isLoaded) return <p>Loading period...</p>;

  return (
    <>
      <h1>Period Details</h1>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Name:</strong> {period.name}</p>
      <p><strong>Characteristics:</strong> {period.characteristics || "-"}</p>
      <p><strong>Years:</strong> {period.years || "-"}</p>

      <form onSubmit={handleDelete}>
        <p>To delete, type the period name: <strong>{period.name}</strong></p>
        <input
          type="text"
          placeholder="Type period name to confirm"
          onChange={handleChange}
          value={formData}
        />
        <button type="submit">Delete</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>

      <Link to={`/updateperiod/${id}`}>
        <p>Update period</p>
      </Link>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
