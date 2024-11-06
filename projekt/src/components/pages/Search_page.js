import React, { useState } from "react";
import "../../styles/pages/Search_page.scss";
import Search_form from "../Search_form";
import "../../styles/App.scss";

function Search_page() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <main className="search_page">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <Search_form onSearchResults={handleSearchResults} />
      <div className="wrapper">
        {searchResults.map((domek) => (
          <div className="card" key={domek.id_domku}>
            <div className="image-wrapper">
              <img
                src={`http://localhost:5000/domki/${domek.id_domku}/${domek.id_domku}_1.jpg`}
                alt={domek.nazwa}
              />
              <span className="category">{domek.kategoria}</span>
            </div>
            <h2>{domek.nazwa}</h2>
            <p>{domek.lokalizacja}</p>
            <p>Liczba osób: {domek.liczba_osob}</p>
            <p>
              Cena: <em>{domek.cena_za_noc} zł</em> /noc
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Search_page;
