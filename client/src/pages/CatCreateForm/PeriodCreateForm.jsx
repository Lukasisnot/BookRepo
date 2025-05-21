import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createPeriod } from "../../models/Period";

export default function PeriodCreateForm() {
  const [formData, setFormData] = useState({});
  const [info, setInfo] = useState();
  const navigate = useNavigate();

  const postForm = async () => {
    const period = await createPeriod(formData);
    if (period.status === 201) {
      redirectToSuccessPage(period.payload._id);
    } else {
      setInfo(period.msg);
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
    return navigate(`/createdperiod/${id}`);
  };

  return (
    <>
      <h1>Create Literary Period</h1>
      <form>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter period name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Short description"
          onChange={handleChange}
        />
        <input
          type="number"
          name="from"
          placeholder="From year"
          onChange={handleChange}
        />
        <input
          type="number"
          name="to"
          placeholder="To year"
          onChange={handleChange}
        />
        <button onClick={handlePost}>Create period</button>
      </form>
      {info && <p style={{ color: "red" }}>{info}</p>}
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
