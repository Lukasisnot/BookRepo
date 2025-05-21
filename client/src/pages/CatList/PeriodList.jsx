import { Link } from "react-router-dom";
import PeriodLink from "./PeriodLink";
import { useState, useEffect } from "react";
import api from "../../api"
import { getPeriods } from "../../models/Period";

export default function PeriodList() {
  const [periods, setPeriods] = useState();
  const [isLoaded, setLoaded] = useState(false);

  const load = async () => {
    const data = await api.get("/getP");
    if (data.status === 500 || data.status === 404) return setLoaded(null);
    if (data.status === 200) {
      setPeriods(data.payload);
      setLoaded(true);
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
