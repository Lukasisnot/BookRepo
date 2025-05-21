import "./MainPage.css";
import Content from "../../components/MainPage/Content";
import NavBar from "../../components/NavBar";

import { Link } from "react-router-dom";
import { Button } from "flowbite-react"

export default function MainPage() {
  return (
    <>
    <NavBar />
      <h1>Main page</h1>
      <Link to={"/createperiod"}>
        <p class="underline">Create cat</p>
      </Link>
      <Button color="alternative">hello</Button>
      <Content />
      <Link to={"/period"}>
        <p>Cats</p>
      </Link>
    </>
  );
}
