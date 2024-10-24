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
  const [isDatePickerOpen, setDatePickerOpen] = useState(false); // Stan do otwierania i zamykania DatePicker
  const dropdownRef = useRef(null); // Ref dla dropdown menu

  // Obsługa zmiany zakresu dat
  const handleDateChange = (dates) => {
    const [start, end] = dates; // Start i koniec zakresu
    setSearchData((prevData) => ({
      ...prevData,
      dateRange: [start, end], // Aktualizacja zakresu
    }));
  };

  // Obsługa zmiany lokalizacji
  const handleLocationChange = (e) => {
    const { value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      location: value,
    }));
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
      guests: prevData.guests > 1 ? prevData.guests - 1 : 1,
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

  // Sterowanie otwieraniem listy kategorii
  const toggleCategoryDropdown = () => {
    setCategoryOpen(!isCategoryOpen);
  };

  // Placeholder dla listy rozwijanej
  const getDropdownPlaceholder = () => {
    if (selectedCategories.length > 0) {
      return `Wybrano: ${selectedCategories.length}`;
    }
    return "Wybierz krajobraz";
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
            selected={searchData.dateRange[0]} // Początek zakresu
            onChange={handleDateChange}
            startDate={searchData.dateRange[0]} // Początek zakresu
            endDate={searchData.dateRange[1]} // Koniec zakresu
            selectsRange // Umożliwia wybór zakresu dat
            minDate={new Date().setHours(0, 0, 0, 0)} // Minimalna data to dzisiaj
            dateFormat="dd/MM/yyyy"
            className="date_input"
            placeholderText="Wybierz datę"
            isClearable={true}
            locale={pl}
            onCalendarOpen={() => setDatePickerOpen(true)}
            onCalendarClose={() => setDatePickerOpen(false)}
            calendarClassName={isDatePickerOpen ? "open" : ""}
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
            onChange={handleLocationChange}
          />
        </div>

        {/* Lista rozwijana kategorii */}
        <div className="form_group" ref={dropdownRef}>
          <label>Krajobraz</label>
          <div className="dropdown">
            <button
              type="button"
              className={`dropdown_toggle ${
                selectedCategories.length > 0 ? "selected" : ""
              }`}
              onClick={toggleCategoryDropdown}
            >
              {getDropdownPlaceholder()}
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
              readOnly
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
