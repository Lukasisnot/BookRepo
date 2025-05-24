import { Link, useParams } from "react-router-dom";

export default function CreatedAuthor() {
  const { id } = useParams();

  return (
    <>
      <h1>Author Created Successfully!</h1>
      <p><strong>Author ID:</strong> {id}</p>

      <Link to={`/author/${id}`}>
        <button>View Author</button>
      </Link>

      <Link to="/">
        <button>Go Home</button>
      </Link>
    </>
  );
}
