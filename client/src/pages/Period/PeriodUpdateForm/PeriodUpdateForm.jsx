import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // Adjust path if needed

export default function PeriodUpdateForm() {
  const { id } = useParams();
  const [period, setPeriod] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const load = async () => {
    try {
      const response = await api.get(`/period/${id}`);
      if (response.status === 200) {
        const fetchedPeriod = response.data.payload;
        setPeriod(fetchedPeriod);
        setFormData({
          name: fetchedPeriod.name || "",
          description: fetchedPeriod.description || "",
        });
        setLoaded(true);
      }
    } catch (error) {
      console.error(error);
      setLoaded(null);
    }
  };

  const postForm = async () => {
    try {
      const response = await api.put(`/period/${id}`, formData);
      if (response.status === 200) {
        navigate(`/period/${id}`);
      } else {
        setInfo(response.data.msg || "Update failed.");
      }
    } catch (error) {
      setInfo("Error while updating the period.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePost = (e) => {
    e.preventDefault();
    postForm();
  };

  useEffect(() => {
    load();
  }, [id]);

  if (isLoaded === null) return <p>Period not found</p>;
  if (!isLoaded) return <p>Period is loading...</p>;

  return (
    <>
      <h1>Period Update Form</h1>
      <p>ID: {id}</p>
      <form onSubmit={handlePost}>
        <input
          type="text"
          name="name"
          value={formData.name}
          required
          placeholder="Enter period name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          required
          placeholder="Enter description"
          onChange={handleChange}
        />
        <button type="submit">Update Period</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
