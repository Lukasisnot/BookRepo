import "./MainPage.css";
import Content from "../../components/MainPage/Content";
import NavBar from "../../components/NavBar";

import { Link } from "react-router-dom";
import { Button } from "flowbite-react"

export default function MainPage() {
  return (
    <>
    <NavBar />
      <h1>Periods</h1>
      <Link to={"/createperiod"}>
        <p class="underline">Create period</p>
      </Link>
      <Button color="alternative">hello</Button>
      <Content />
      <Link to={"/period"}>
        <p>Periods</p>
      </Link>
      <h1>Literary groups</h1>
       <Link to={"/createliterary-group"}>
        <p class="underline">Create literary group</p>
      </Link>
      <Link to={"/literary-group"}>
        <p>literary Groups</p>
      </Link>

      <h1>Author</h1>
       <Link to={"/createauthor"}>
        <p class="underline">Create author</p>
      </Link>
      <Link to={"/author"}>
        <p>authors</p>
      </Link>

      <h1>Book</h1>
       <Link to={"/createbook"}>
        <p class="underline">Create book</p>
      </Link>
      <Link to={"/book"}>
        <p>books</p>
      </Link>
    </>
  );
}
