import { Link } from "react-router-dom";

export default function PeriodLink(props) {
  return (
    <>
      <Link to={`/period/${props._id}`}>
        <p>{props.name}</p>
      </Link>
    </>
  );
}
