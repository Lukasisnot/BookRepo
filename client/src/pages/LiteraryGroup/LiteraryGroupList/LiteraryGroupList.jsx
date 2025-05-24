import { Link } from "react-router-dom";
import LiteraryGroupLink from "./LiteraryGroupLink";
import { useState, useEffect } from "react";
import api from "../../../api"

export default function LiteraryGroupList() {
  const [LiteraryGroups, setLiteraryGroups] = useState();
  const [isLoaded, setLoaded] = useState(false);

  const load = async () => {
  try {
    const response = await api.get("/literary-group"); // upraveno podle backendu
    console.log("Response:", response);
    if (response.status === 200) {
      setLiteraryGroups(response.data.payload); // axios data je v `data`
      setLoaded(true);
    }
  } catch (error) {
    console.error("Error fetching LiteraryGroups:", error);
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
        <p>LiteraryGroups not found</p>
      </>
    );
  }

  if (!isLoaded) {
    return (
      <>
        <p>LiteraryGroups are loading...</p>
      </>
    );
  }

  return (
    <>
      <h1>LiteraryGroup List</h1>
      {LiteraryGroups.map((LiteraryGroup, index) => (
        <LiteraryGroupLink key={index} {...LiteraryGroup} />
      ))}
      <Link to={"/"}>
        <p>Go back</p>
      </Link>
    </>
  );
}
