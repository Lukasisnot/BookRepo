import { Link } from "react-router-dom";

export default function AuthorLink(props) {
  return (
    <>
      <Link to={`/author/${props._id}`}>
        <p>{props.name}</p>
      </Link>
    </>
  );
}
