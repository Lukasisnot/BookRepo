import { Link } from "react-router-dom";
import PeriodLink from "./PeriodLink";
import { useState, useEffect } from "react";
import api from "../../api"

export default function PeriodList() {
  const [periods, setPeriods] = useState();
  const [isLoaded, setLoaded] = useState(false);

  const load = async () => {
  try {
    const response = await api.get("/period"); // upraveno podle backendu
    console.log("Response:", response);
    if (response.status === 200) {
      setPeriods(response.data.payload); // axios data je v `data`
      setLoaded(true);
    }
  } catch (error) {
    console.error("Error fetching periods:", error);
    if (error.response) {
      if (error.response.status === 404 || error.response.status === 500) {
        setLoaded(null);
      }
    }
  }
};


  useEffect(() => {
    load();
  }, []);

  if (isLoaded === null) {
    return (
      <>
        <p>Periods not found</p>
      </>
    );
  }

  if (!isLoaded) {
    return (
      <>
        <p>Periods are loading...</p>
      </>
    );
  }

  return (
    <>
      <h1>Period List</h1>
      {periods.map((period, index) => (
        <PeriodLink key={index} {...period} />
      ))}
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
