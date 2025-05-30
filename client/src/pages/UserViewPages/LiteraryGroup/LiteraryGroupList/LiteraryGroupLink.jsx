import { Link } from "react-router-dom";

export default function LiteraryGroupLink(props) {
  return (
    <>
      <Link to={`/literary-groupuser/${props._id}`}>
        <p>{props.name}</p>
      </Link>
    </>
  );
}
