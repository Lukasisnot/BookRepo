import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // Adjust the path to your axios instance

export default function LiteraryGroupUpdateForm() {
  const { id } = useParams();
  const [literaryGroup, setLiteraryGroup] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const load = async () => {
    try {
      const response = await api.get(`/literary-group/${id}`);
      if (response.status === 200) {
        setLiteraryGroup(response.data.payload);
        setFormData({
          name: response.data.payload.name || "",
          description: response.data.payload.description || "",
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
      const response = await api.put(`/literary-group/${id}`, formData);
      if (response.status === 200) {
        navigate(`/literary-group/${id}`);
      } else {
        setInfo(response.data.msg || "Failed to update");
      }
    } catch (error) {
      setInfo("Error occurred while updating");
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

  if (isLoaded === null) return <p>Literary group not found.</p>;
  if (!isLoaded) return <p>Loading literary group...</p>;

  return (
    <>
      <h1>Update Literary Group</h1>
      <p>ID: {id}</p>
      <form onSubmit={handlePost}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter literary group name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Enter description"
          onChange={handleChange}
          required
        />
        <button type="submit">Update Literary Group</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
