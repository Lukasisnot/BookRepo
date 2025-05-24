import { Link } from "react-router-dom";
import AuthorLink from "./AuthorLink";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function AuthorList() {
  const [authors, setAuthors] = useState();
  const [isLoaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const response = await api.get("/author");
      console.log("Response:", response);
      if (response.status === 200) {
        setAuthors(response.data.payload);
        setLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      if (error.response) {
        if (error.response.status === 404 || error.response.status === 500) {
          setLoaded(null);
        }
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoaded === null) {
    return (
      <>
        <p>Authors not found</p>
      </>
    );
  }

  if (!isLoaded) {
    return (
      <>
        <p>Authors are loading...</p>
      </>
    );
  }

  return (
    <>
      <h1>Author List</h1>
      {authors.map((author, index) => (
        <AuthorLink key={index} {...author} />
      ))}
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
