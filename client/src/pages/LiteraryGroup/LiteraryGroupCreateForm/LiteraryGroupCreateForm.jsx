import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../api"; // axios instance

export default function LiteraryGroupCreateForm() {
  const [formData, setFormData] = useState({});
  const [info, setInfo] = useState();
  const navigate = useNavigate();

  const postForm = async () => {
    try {
      const response = await api.post("/literary-group", formData);
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
    navigate(`/createdliterary-group/${id}`);
  };

  return (
    <>
      <h1>Create Literary Literary Group</h1>
      <form>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter LiteraryGroup name"
          onChange={handleChange}
        />
        <input
          type="text"  // <-- changed from number to text
          name="years"
          placeholder="Years (e.g. 1500-1600)"
          onChange={handleChange}
        />
        <input
          type="text"
          name="characteristics"
          placeholder="Short description"
          onChange={handleChange}
        />
        <input
          type="text"
          name="members"
          placeholder="members"
          onChange={handleChange}
        />
        
        
        <button onClick={handlePost}>Create LiteraryGroup</button>
      </form>
      {info && <p style={{ color: "red" }}>{info}</p>}
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
