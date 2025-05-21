import { Link, useParams, useNavigate } from "react-router-dom";
import {   getPeriod, deletePeriod } from "../../models/Period";
import { useState, useEffect } from "react";

export default function PeriodView() {
  const { id } = useParams();
  const [cat, setCat] = useState();
  const [isLoaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  const load = async () => {
    const data = await getPeriod(id);
    if (data.status === 500 || data.status === 404) return setLoaded(null);
    if (data.status === 200) {
      setCat(data.payload);
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setFormData(e.target.value);
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    if (cat.name === formData) {
      const data = await deletePeriod(id);
      if (data.status === 200) {
        navigate("/");
      } else {
        setInfo(data.msg);
      }
    } else {
      setInfo("Wrong input!");
    }
  }

  if (isLoaded === null) {
    return (
      <>
        <p>period not found</p>
      </>
    )
  }

  if (!isLoaded) {
    return (
      <>
        <p>period is loading...</p>
      </>
    )
  }

  return (
    <>
      <h1>period view</h1>
      <p>{id}</p>
      <p>{cat.name}</p>
      <p>{cat.description}</p>
      
      <form>
        <input type="text" placeholder={cat.name} onChange={handleChange} />
        <button onClick={handleDelete}>Delete</button>
        <p>{info}</p>
      </form>
      <Link to={`/updatecat/${id}`}>
        <p>Update period</p>
      </Link>
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
