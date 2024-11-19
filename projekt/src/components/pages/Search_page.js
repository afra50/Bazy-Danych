// Search_page.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Link, useLocation } from "react-router-dom";
import "../../styles/pages/Search_page.scss";
import Search_form from "../Search_form";
import "../../styles/App.scss";

function Search_page() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [searchParams, setSearchParams] = useState(() => {
    const savedParams = sessionStorage.getItem("searchParams");
    return savedParams
      ? JSON.parse(savedParams)
      : {
          dateRange: [null, null],
          location: "",
          guests: 1,
          categories: [],
        };
  });

  const [sort, setSort] = useState("most_relevant");
  const [totalResults, setTotalResults] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const resultsPerPage = 9;

  const locationState = useLocation();

  useEffect(() => {
    if (locationState.state && locationState.state.searchParams) {
      const initialSearchParams = locationState.state.searchParams;
      setSearchParams(initialSearchParams);
      performSearch(initialSearchParams, sort);
    } else {
      performSearch(searchParams, sort);
    }
  }, [locationState.state]);

  const performSearch = (params, currentSort) => {
    const combinedParams = { ...params, sort: currentSort };

    sessionStorage.setItem("searchParams", JSON.stringify(params));

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
        setSearchPerformed(true);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania wyników:", error);
        setSearchPerformed(true);
      });
  };

  const handleSearchResults = (data, isNewSearch, params) => {
    const { total, results } = data;
    if (isNewSearch) {
      setSearchResults(results);
      setCurrentPage(1);
      setSearchParams(params);
      setTotalResults(total);

      sessionStorage.setItem("searchParams", JSON.stringify(params));
    } else {
      setSearchResults((prevResults) => [...prevResults, ...results]);
    }
    setHasMore(results.length === resultsPerPage);
    setSearchPerformed(true);
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
      sort: sort,
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
        setSearchPerformed(true);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania wyników:", error);
        setSearchPerformed(true);
      });
  };

  // Opcje sortowania
  const sortOptions = [
    { value: "most_relevant", label: "Najtrafniejsze" },
    { value: "price_asc", label: "Cena: rosnąco" },
    { value: "price_desc", label: "Cena: malejąco" },
  ];

  // Funkcja do obsługi zmiany sortowania
  const handleSortChange = (selectedOption) => {
    const selectedSort = selectedOption.value;
    setSort(selectedSort);
    setCurrentPage(1);
    performSearch(searchParams, selectedSort);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#fff",
      borderColor: state.isFocused ? "#007bff" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(0,123,255,.25)" : null,
      "&:hover": {
        borderColor: "#80bdff",
      },
      fontFamily: "Arial, sans-serif",
      fontSize: "1rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#0056b3"
        : "#fff",
      color: state.isSelected ? "#fff" : "#495057",
      fontFamily: "Arial, sans-serif",
      fontSize: "1rem",
      padding: "0.5rem",
      textAlign: "left",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#0056b3",
        color: "#fff",
      },
      "&--is-focused": {
        backgroundColor: "#0056b3",
        color: "#fff",
      },
      "&--is-selected": {
        backgroundColor: "#007bff",
        color: "#fff",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      border: "1px solid #007bff",
      borderRadius: "4px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#007bff",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#007bff",
      "&:hover": {
        color: "#fff",
      },
    }),
  };

  return (
    <main className="search_page">
      <Link to="/" className="back">
        <i className="fa-solid fa-chevron-left"></i>
        Wróć do strony głównej
      </Link>

      {/* Formularz wyszukiwania */}
      <Search_form
        onSearchResults={handleSearchResults}
        initialData={searchParams}
      />
      <hr />

      <div className="sort_and_results">
        {/* Opcje sortowania */}
        <div className="sort_options">
          <label htmlFor="sort_select">Sortuj według:</label>
          <Select
            id="sort_select"
            value={sortOptions.find((option) => option.value === sort)}
            onChange={handleSortChange}
            options={sortOptions}
            classNamePrefix="react-select"
            placeholder="Wybierz opcję"
            styles={customStyles}
            isSearchable={false}
          />
        </div>

        {/* Wyświetlanie liczby wyników */}
        {totalResults > 0 && (
          <p className="total-results">Znaleziono: {totalResults} domków</p>
        )}
      </div>

      {/* Lista wyników */}
      <div className="wrapper">
        {searchResults.map((domek) => (
          <Link
            to={`/houses/${domek.id_domku}`}
            key={domek.id_domku}
            className="card-link"
          >
            <div className="card">
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
          </Link>
        ))}
      </div>

      {/* Przyciski paginacji */}
      {hasMore && searchResults.length > 0 && (
        <button className="load-more" onClick={loadMoreResults}>
          Pokaż więcej
        </button>
      )}

      {/* Komunikat brak wyników */}
      {searchPerformed && totalResults === 0 && (
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
