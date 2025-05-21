import { Link, useParams } from "react-router-dom";

export default function CreatedPeriod() {
  const { id } = useParams();

  return (
    <>
      <h1>Period Created Successfully!</h1>
      <p><strong>Period ID:</strong> {id}</p>
      
      <Link to={`/period/${id}`}>
        <button>View Period</button>
      </Link>
      
      <Link to="/">
        <button>Go Home</button>
      </Link>
    </>
  );
}
