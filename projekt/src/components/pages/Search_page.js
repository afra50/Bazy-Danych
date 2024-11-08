// Search_page.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
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
  const [searchPerformed, setSearchPerformed] = useState(false); // Nowy stan
  const resultsPerPage = 9;

  const locationState = useLocation();

  useEffect(() => {
    if (locationState.state && locationState.state.searchParams) {
      const initialSearchParams = locationState.state.searchParams;
      setSearchParams(initialSearchParams);
      performSearch(initialSearchParams, sort);
    } else {
      // Opcjonalnie wykonaj domyślne wyszukiwanie lub pozostaw puste
      // W tym przypadku wykonamy wyszukiwanie z domyślnymi parametrami
      performSearch(searchParams, sort);
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
        setSearchPerformed(true); // Ustawienie na true po wykonaniu wyszukiwania
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania wyników:", error);
        setSearchPerformed(true); // Ustawienie na true nawet przy błędzie
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
    setSearchPerformed(true); // Ustawienie na true po otrzymaniu wyników
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
        setSearchPerformed(true); // Ustawienie na true po otrzymaniu wyników
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania wyników:", error);
        setSearchPerformed(true); // Ustawienie na true nawet przy błędzie
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

  // Obiekt customStyles dla react-select
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
      textAlign: "left", // Wyrównanie tekstu do lewej strony
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#0056b3", // $hover-color
        color: "#fff", // Biały tekst
      },
      "&--is-focused": {
        backgroundColor: "#0056b3", // $hover-color
        color: "#fff", // Biały tekst
      },
      "&--is-selected": {
        backgroundColor: "#007bff", // $primary-color
        color: "#fff", // Biały tekst
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
      color: "#007bff", // $primary-color
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#007bff", // $primary-color
      "&:hover": {
        color: "#fff", // Biały kolor przy hover
      },
    }),
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
          <Select
            id="sort_select"
            value={sortOptions.find((option) => option.value === sort)}
            onChange={handleSortChange}
            options={sortOptions}
            classNamePrefix="react-select"
            placeholder="Wybierz opcję"
            styles={customStyles} // Przekazujemy customStyles
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
