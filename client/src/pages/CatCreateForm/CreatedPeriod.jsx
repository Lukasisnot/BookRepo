import { Link, useParams } from "react-router-dom";

export default function CreatedPeriod() {
  const { id } = useParams();  

  return (
    <>
      <p>Created period: {id}</p>
      <Link to={`/period/${id}`}>
        <p>View period</p>
      </Link>
      <Link to={"/"}>
        <p>Go home</p>
      </Link>
    </>
  );
}
