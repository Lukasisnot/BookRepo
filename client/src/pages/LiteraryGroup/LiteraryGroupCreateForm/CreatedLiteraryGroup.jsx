import { Link, useParams } from "react-router-dom";

export default function CreatedLiteraryGroup() {
  const { id } = useParams();

  return (
    <>
      <h1>LiteraryGroup Created Successfully!</h1>
      <p><strong>LiteraryGroup ID:</strong> {id}</p>
      
      <Link to={`/literary-group/${id}`}>
        <button>View LiteraryGroup</button>
      </Link>
      
      <Link to="/">
        <button>Go Home</button>
      </Link>
    </>
  );
}
