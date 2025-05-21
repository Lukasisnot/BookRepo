import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updatePeriod, getPeriod } from "../../models/Period";

export default function PeriodUpdateForm() {
  const { id } = useParams();
  const [period, setPeriod] = useState();
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  const load = async () => {
    const data = await getPeriod(id);
    if (data.status === 500 || data.status === 404) return setLoaded(null);
    if (data.status === 200) {
      setPeriod(data.payload);
      setLoaded(true);
    }
  };

  const postForm = async () => {
    const result = await updatePeriod(id, formData);
    if (result.status === 200) {
      navigate(`/period/${id}`);
    } else {
      setInfo(result.msg);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = (e) => {
    e.preventDefault();
    postForm();
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoaded === null) {
    return (
      <>
        <p>Period not found</p>
      </>
    );
  }

  if (!isLoaded) {
    return (
      <>
        <p>Period is loading...</p>
      </>
    );
  }

  return (
    <>
      <h1>Period Update Form</h1>
      <p>{id}</p>
      <form>
        <input
          type="text"
          defaultValue={period.name}
          name="name"
          required
          placeholder="Enter period name"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          defaultValue={period.description}
          name="description"
          required
          placeholder="Enter description"
          onChange={(e) => handleChange(e)}
        />
        <button onClick={handlePost}>Update Period</button>
      </form>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
