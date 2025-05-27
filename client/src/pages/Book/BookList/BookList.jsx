import { Link } from "react-router-dom";
import BookLink from "./BookLink";
import { useState, useEffect } from "react";
import api from "../../../api";

export default function BookList() {
  const [books, setBooks] = useState();
  const [isLoaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const response = await api.get("/book");
      if (response.status === 200) {
        setBooks(response.data.payload);
        setLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      if (error.response?.status === 404 || error.response?.status === 500) {
        setLoaded(null);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoaded === null) {
    return <p>Books not found</p>;
  }

  if (!isLoaded) {
    return <p>Books are loading...</p>;
  }

  return (
    <>
      <h1>Book List</h1>
      {books.map((book) => (
        <BookLink key={book._id} {...book} />
      ))}
      <Link to="/">
        <p>Go back</p>
      </Link>
    </>
  );
}
