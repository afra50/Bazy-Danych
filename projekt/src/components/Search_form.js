import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { pl } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DatePicker.scss";
import "../styles/Search_form.scss";

function Search_form() {
  const [searchData, setSearchData] = useState({
    dateRange: [null, null], // Zakres dat
    location: "", // Lokalizacja
    guests: 1, // Początkowa liczba gości ustawiona na 1
  });
  const [isCategoryOpen, setCategoryOpen] = useState(false); // Sterowanie otwieraniem/ zamykaniem listy krajobrazu
  const [selectedCategories, setSelectedCategories] = useState([]); // Zaznaczone kategorie
  const dropdownRef = useRef(null); // Ref dla dropdown menu

  // Obsługa zmiany zakresu dat
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSearchData((prevData) => ({
      ...prevData,
      dateRange: [start, end],
    }));
  };

  // Obsługa zmian w checkboxach krajobrazu
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prevCategories) => [...prevCategories, value]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((category) => category !== value)
      );
    }
  };

  // Zwiększanie liczby gości
  const handleIncreaseGuests = () => {
    setSearchData((prevData) => ({
      ...prevData,
      guests: prevData.guests + 1,
    }));
  };

  // Zmniejszanie liczby gości z limitem minimalnym 1
  const handleDecreaseGuests = () => {
    setSearchData((prevData) => ({
      ...prevData,
      guests: prevData.guests > 1 ? prevData.guests - 1 : 1, // Minimalna liczba to 1
    }));
  };

  // Sterowanie otwieraniem listy kategorii
  const toggleCategoryDropdown = () => {
    setCategoryOpen(!isCategoryOpen);
  };

  // Nasłuchiwanie kliknięcia poza komponentem
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obsługa wysyłania formularza
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Wyszukiwanie:", searchData, selectedCategories);
  };

  return (
    <form className="search_form" onSubmit={handleSubmit}>
      <div className="form_groups">
        {/* Pole wyboru zakresu dat */}
        <div className="form_group">
          <label>Data wyjazdu</label>
          <DatePicker
            selected={searchData.dateRange[0]}
            onChange={handleDateChange}
            startDate={searchData.dateRange[0]}
            endDate={searchData.dateRange[1]}
            selectsRange
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="date_input"
            placeholderText="Wybierz datę"
            isClearable={true}
            locale={pl}
          />
        </div>

        {/* Pole lokalizacji */}
        <div className="form_group">
          <label>Lokalizacja</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Dokąd jedziesz?"
            value={searchData.location}
            onChange={(e) =>
              setSearchData({ ...searchData, location: e.target.value })
            }
          />
        </div>

        {/* Lista rozwijana kategorii */}
        <div className="form_group" ref={dropdownRef}>
          <label>Krajobraz</label>
          <div className="dropdown">
            <button
              type="button"
              className="dropdown_toggle"
              onClick={toggleCategoryDropdown}
            >
              Wybierz krajobraz
            </button>
            <div
              className={`dropdown_menu ${
                isCategoryOpen ? "dropdown-visible" : ""
              }`}
            >
              <label className="category">
                <input
                  type="checkbox"
                  value="gory"
                  checked={selectedCategories.includes("gory")}
                  onChange={handleCategoryChange}
                />
                Góry
              </label>
              <label className="category">
                <input
                  type="checkbox"
                  value="jezioro"
                  checked={selectedCategories.includes("jezioro")}
                  onChange={handleCategoryChange}
                />
                Jezioro
              </label>
              <label className="category">
                <input
                  type="checkbox"
                  value="morze"
                  checked={selectedCategories.includes("morze")}
                  onChange={handleCategoryChange}
                />
                Morze
              </label>
              <label className="category">
                <input
                  type="checkbox"
                  value="rzeka"
                  checked={selectedCategories.includes("rzeka")}
                  onChange={handleCategoryChange}
                />
                Rzeka
              </label>
              <label className="category">
                <input
                  type="checkbox"
                  value="wieś"
                  checked={selectedCategories.includes("wieś")}
                  onChange={handleCategoryChange}
                />
                Wieś
              </label>
              <label className="category">
                <input
                  type="checkbox"
                  value="las"
                  checked={selectedCategories.includes("las")}
                  onChange={handleCategoryChange}
                />
                Las
              </label>
            </div>
          </div>
        </div>

        {/* Licznik gości */}
        <div className="form_group">
          <label>Liczba osób</label>
          <div className="guests_counter">
            <button
              type="button"
              className="guests_button"
              onClick={handleDecreaseGuests}
            >
              -
            </button>
            <input
              type="text"
              id="guests"
              name="guests"
              value={searchData.guests}
              readOnly // Zablokowanie wpisywania ręcznie
            />
            <button
              type="button"
              className="guests_button"
              onClick={handleIncreaseGuests}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className="btn_search">
        Szukaj
      </button>
    </form>
  );
}

export default Search_form;
