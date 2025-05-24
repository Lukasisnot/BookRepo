import { Link } from "react-router-dom";

export default function LiteraryGroupLink(props) {
  return (
    <>
      <Link to={`/literary-group/${props._id}`}>
        <p>{props.name}</p>
      </Link>
    </>
  );
}
