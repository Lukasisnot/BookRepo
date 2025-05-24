import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function AuthorUpdateForm() {
  const { id } = useParams();
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
  const navigate = useNavigate();

  // načíst autora
  const loadAuthor = async () => {
    try {
      const response = await api.get(`/author/${id}`);
      if (response.status === 200) {
        const fetchedAuthor = response.data.payload;
        setAuthor(fetchedAuthor);
        setFormData({
          name: fetchedAuthor.name || "",
          bio: fetchedAuthor.bio || "",
          nationality: fetchedAuthor.nationality || "",
          literary_group: fetchedAuthor.literary_group?._id || "",
          period: fetchedAuthor.period?._id || "",
        });
        setLoaded(true);
      }
    } catch (error) {
      console.error(error);
      setLoaded(null);
    }
  };

  // načíst literary groups
  const loadLiteraryGroups = async () => {
    try {
      const response = await api.get("/literary-group");
      if (response.status === 200) {
        setLiteraryGroups(response.data.payload);
      }
    } catch (error) {
      console.error("Failed to load literary groups", error);
    }
  };

  // načíst periods
  const loadPeriods = async () => {
    try {
      const response = await api.get("/period");
      if (response.status === 200) {
        setPeriods(response.data.payload);
      }
    } catch (error) {
      console.error("Failed to load periods", error);
    }
  };

  // submit formu (update autora)
  const postForm = async () => {
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
    loadAuthor();
    loadLiteraryGroups();
    loadPeriods();
  }, [id]);

  if (isLoaded === null) return <p>Author not found</p>;
  if (!isLoaded) return <p>Author is loading...</p>;

  return (
    <>
      <h1>Author Update Form</h1>
      <p>ID: {id}</p>
      <form onSubmit={handlePost}>
        <input
          type="text"
          name="name"
          value={formData.name}
          required
          placeholder="Enter author name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="bio"
          value={formData.bio}
          required
          placeholder="Short biography"
          onChange={handleChange}
        />
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          required
          placeholder="Nationality"
          onChange={handleChange}
        />

        <label>Literary Group</label>
        <select
          name="literary_group"
          value={formData.literary_group}
          onChange={handleChange}
        >
          <option value="">-- None --</option>
          {literaryGroups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>

        <label>Period</label>
        <select
          name="period"
          value={formData.period}
          required
          onChange={handleChange}
        >
          <option value="">-- Select Period --</option>
          {periods.map((period) => (
            <option key={period._id} value={period._id}>
              {period.name}
            </option>
          ))}
        </select>

        <button type="submit">Update Author</button>
        {info && <p style={{ color: "red" }}>{info}</p>}
      </form>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
