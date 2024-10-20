import React from "react";
import "../styles/Search.scss";
import SearchForm from "./Search_form";
import Search_form from "./Search_form";

function Search() {
  return (
    <section className="search">
      <div className="main_writing">
        <h1 className="main_title">Odnajdź swoje miejsce</h1>
        <span className="main_subtitle">
          Wyszukaj idealne miejsce na wypoczynek – szybko i łatwo.
        </span>
      </div>
      <Search_form></Search_form>
    </section>
  );
}

export default Search;
