import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api"; // axios instance

export default function AuthorCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nationality: "",
    literary_group: "",
    period: "",
  });
  const [info, setInfo] = useState();
  const [literaryGroups, setLiteraryGroups] = useState([]);
  const [periods, setPeriods] = useState([]);
  const navigate = useNavigate();

  // Fetch dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lgRes, periodRes] = await Promise.all([
          api.get("/literary-group"),
          api.get("/period"),
        ]);
        setLiteraryGroups(lgRes.data.payload || []);
        setPeriods(periodRes.data.payload || []);
      } catch (err) {
        setInfo("Failed to load groups or periods.");
      }
    };

    fetchData();
  }, []);

  const postForm = async () => {
    try {
      const response = await api.post("/author", formData);
      if (response.status === 201) {
        redirectToSuccessPage(response.data.payload._id);
      } else {
        setInfo(response.data.msg || "Unknown error");
      }
    } catch (error) {
      if (error.response) {
        setInfo(error.response.data.msg || "Server error");
      } else {
        setInfo("Network error");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = (e) => {
    e.preventDefault();
    postForm();
  };

  const redirectToSuccessPage = (id) => {
    navigate(`/createdauthor/${id}`);
  };

  return (
    <>
      <h1>Create Author</h1>
      <form>
        <input
          type="text"
          name="name"
          required
          placeholder="Author's full name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nationality"
          required
          placeholder="Nationality"
          value={formData.nationality}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          required
          placeholder="Biography"
          rows={4}
          value={formData.bio}
          onChange={handleChange}
        />

        {/* Optional Literary Group */}
        <select name="literary_group" value={formData.literary_group} onChange={handleChange}>
          <option value="">Select Literary Group (optional)</option>
          {literaryGroups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>

        {/* Required Period */}
        <select name="period" required value={formData.period} onChange={handleChange}>
          <option value="">Select Literary Period</option>
          {periods.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <button onClick={handlePost}>Create Author</button>
      </form>

      {info && <p style={{ color: "red" }}>{info}</p>}
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
