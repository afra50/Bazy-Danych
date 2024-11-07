// Search_page.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/pages/Search_page.scss";
import Search_form from "../Search_form";
import "../../styles/App.scss";

function Search_page() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 9;

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.searchParams) {
      const initialSearchParams = location.state.searchParams;
      setSearchParams(initialSearchParams);
      performSearch(initialSearchParams);
    }
  }, [location.state]);

  const performSearch = (params) => {
    fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => {
        const { total, results } = data;
        setSearchResults(results);
        setCurrentPage(1);
        setHasMore(results.length === resultsPerPage);
        setTotalResults(total);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania wyników:", error);
      });
  };

  const handleSearchResults = (data, isNewSearch, params) => {
    const { total, results } = data;
    if (isNewSearch) {
      setSearchResults(results);
      setCurrentPage(1);
      setSearchParams(params);
      setTotalResults(total);
    } else {
      setSearchResults((prevResults) => [...prevResults, ...results]);
    }
    setHasMore(results.length === resultsPerPage);
  };

  const loadMoreResults = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (currentPage > 1) {
      fetchMoreResults();
    }
  }, [currentPage]);

  const fetchMoreResults = () => {
    const params = {
      ...searchParams,
      page: currentPage,
      limit: resultsPerPage,
    };

    fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => {
        const { results } = data;
        setSearchResults((prevResults) => [...prevResults, ...results]);
        setHasMore(results.length === resultsPerPage);
        // 'totalResults' pozostaje niezmienione, ponieważ jest już ustawione przy pierwszym wyszukiwaniu
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania wyników:", error);
      });
  };

  return (
    <main className="search_page">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <Search_form
        onSearchResults={handleSearchResults}
        initialData={searchParams} // Przekazujemy initialData do Search_form
      />
      {totalResults > 0 && (
        <p className="total-results">Znaleziono: {totalResults} </p>
      )}
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
      {hasMore && searchResults.length > 0 && (
        <button className="load-more" onClick={loadMoreResults}>
          Pokaż więcej
        </button>
      )}
      {totalResults === 0 && (
        <p className="no-results">
          Niestety nie mamy domków spełniających kryteria. Spróbuj zmienić
          kryteria wyszukiwania.
          <i class="fa-regular fa-face-frown"></i>
        </p>
      )}
    </main>
  );
}

export default Search_page;
