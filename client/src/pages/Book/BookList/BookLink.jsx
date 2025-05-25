import { Link } from "react-router-dom";

export default function BookLink({ _id, title }) {
  return (
    <Link to={`/book/${_id}`}>
      <p>{title}</p>
    </Link>
  );
}
