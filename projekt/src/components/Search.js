import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Search.scss";
import Search_form from "./Search_form";

function Search() {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchParams) => {
    navigate("/searchpage", { state: { searchParams } });
  };

  return (
    <section className="search">
      <div className="main_writing">
        <h1 className="main_title">Odnajdź swoje miejsce</h1>
        <span className="main_subtitle">
          Wyszukaj idealne miejsce na wypoczynek – szybko i łatwo.
        </span>
      </div>
      <Search_form onSubmit={handleSearchSubmit}></Search_form>
    </section>
  );
}

export default Search;
