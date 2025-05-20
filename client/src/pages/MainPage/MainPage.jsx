import "./MainPage.css";
import Content from "../../components/MainPage/Content";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react"

export default function MainPage() {
  return (
    <>
      <h1>Main page</h1>
      <Link to={"/createcat"}>
        <p class="underline">Create cat</p>
      </Link>
      <Button color="alternative">hello</Button>
      <Content />
      <Link to={"/cats"}>
        <p>Cats</p>
      </Link>
    </>
  );
}
