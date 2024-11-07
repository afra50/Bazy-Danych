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
  const [searchParams, setSearchParams] = useState({
    dateRange: [null, null],
    location: "",
    guests: 1,
    categories: [],
  });
  const [sort, setSort] = useState("most_relevant");
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 9;

  const locationState = useLocation();

  useEffect(() => {
    if (locationState.state && locationState.state.searchParams) {
      const initialSearchParams = locationState.state.searchParams;
      setSearchParams(initialSearchParams);
      performSearch(initialSearchParams, sort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState.state]);

  const performSearch = (params, currentSort) => {
    const combinedParams = { ...params, sort: currentSort };

    fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(combinedParams),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchMoreResults = () => {
    const params = {
      ...searchParams,
      sort: sort, // Uwzględnij sortowanie
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

  // Funkcja do obsługi zmiany sortowania
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    setCurrentPage(1);
    performSearch(searchParams, selectedSort);
  };

  return (
    <main className="search_page">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      {/* Formularz wyszukiwania */}
      <Search_form
        onSearchResults={handleSearchResults}
        initialData={searchParams} // Przekazujemy initialData do Search_form
      />
      <hr></hr>

      <div className="sort_and_results">
        {/* Opcje sortowania */}
        <div className="sort_options">
          <label htmlFor="sort_select">Sortuj według:</label>
          <select
            id="sort_select"
            value={sort}
            onChange={handleSortChange}
            className="sort_select"
          >
            <option value="most_relevant">Najtrafniejsze</option>
            <option value="price_asc">Cena: rosnąco</option>
            <option value="price_desc">Cena: malejąco</option>
          </select>
        </div>

        {/* Wyświetlanie liczby wyników */}
        {totalResults > 0 && (
          <p className="total-results">Znaleziono: {totalResults} domków</p>
        )}
      </div>

      {/* Lista wyników */}
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

      {/* Przyciski paginacji */}
      {hasMore && searchResults.length > 0 && (
        <button className="load-more" onClick={loadMoreResults}>
          Pokaż więcej
        </button>
      )}

      {/* Komunikat brak wyników */}
      {totalResults === 0 && (
        <p className="no-results">
          Niestety nie mamy domków spełniających kryteria. Spróbuj zmienić
          kryteria wyszukiwania.
          <i className="fa-regular fa-face-frown"></i>
        </p>
      )}
    </main>
  );
}

export default Search_page;
