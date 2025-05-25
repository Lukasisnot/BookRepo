import { Link, useParams } from "react-router-dom";

export default function CreatedBook() {
  const { id } = useParams();

  return (
    <>
      <h1>Book Created Successfully!</h1>
      <p><strong>Book ID:</strong> {id}</p>

      <Link to={`/book/${id}`}>
        <button>View Book</button>
      </Link>

      <Link to="/">
        <button>Go Home</button>
      </Link>
    </>
  );
}
