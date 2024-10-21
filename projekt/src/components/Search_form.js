import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Style dla kalendarza
import "../styles/Search_form.scss"; // Twoje style

function Search_form() {
  const [searchData, setSearchData] = useState({
    dateRange: [null, null], // Zakres dat
    location: "", // Lokalizacja
    guests: "", // Liczba gości, początkowo pusty string
  });
  const [isCategoryOpen, setCategoryOpen] = useState(false); // Sterowanie otwieraniem/ zamykaniem listy krajobrazu
  const [selectedCategories, setSelectedCategories] = useState([]); // Zaznaczone kategorie

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

  // Sterowanie otwieraniem listy kategorii
  const toggleCategoryDropdown = () => {
    setCategoryOpen(!isCategoryOpen);
  };

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
            selected={searchData.dateRange[0]} // Data początkowa
            onChange={handleDateChange}
            startDate={searchData.dateRange[0]} // Data początkowa
            endDate={searchData.dateRange[1]} // Data końcowa
            selectsRange // Umożliwia wybór zakresu dat
            minDate={new Date()} // Blokowanie dat przeszłych
            dateFormat="dd/MM/yyyy"
            className="date_input" // Klasa do stylowania
            placeholderText="Kiedy jedziesz?" // Tekst zastępczy, jeśli data nie jest wybrana
            isClearable={true} // Pozwala wyczyścić wybór daty
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
            required
          />
        </div>

        {/* Lista rozwijana kategorii */}
        <div className="form_group">
          <label>Krajobraz</label>
          <div className="dropdown">
            <button
              type="button"
              className="dropdown_toggle"
              onClick={toggleCategoryDropdown}
            >
              W jakiej lokalizacji?
            </button>
            {isCategoryOpen && (
              <div className="dropdown_menu">
                <label>
                  <input
                    type="checkbox"
                    value="gory"
                    checked={selectedCategories.includes("gory")}
                    onChange={handleCategoryChange}
                  />
                  Góry
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="jezioro"
                    checked={selectedCategories.includes("jezioro")}
                    onChange={handleCategoryChange}
                  />
                  Jezioro
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="morze"
                    checked={selectedCategories.includes("morze")}
                    onChange={handleCategoryChange}
                  />
                  Morze
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="miasto"
                    checked={selectedCategories.includes("miasto")}
                    onChange={handleCategoryChange}
                  />
                  Miasto
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Pole liczby gości */}
        <div className="form_group">
          <label>Goście</label>
          <input
            type="number"
            id="guests"
            name="guests"
            min="1"
            placeholder="Liczba gości"
            value={searchData.guests}
            onChange={(e) =>
              setSearchData({ ...searchData, guests: e.target.value })
            }
            required
          />
        </div>
      </div>

      <button type="submit" className="btn_search">
        Szukaj
      </button>
    </form>
  );
}

export default Search_form;
