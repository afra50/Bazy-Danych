import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Style dla kalendarza

import "../styles/Search_form.scss"; // Twoje style

function Search_form() {
  const [searchData, setSearchData] = useState({
    dateRange: [new Date(), new Date()], // Zakres dat: [data początkowa, data końcowa]
    category: "",
    location: "",
    guests: 1,
  });

  // Obsługa zmiany zakresu dat
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSearchData((prevData) => ({
      ...prevData,
      dateRange: [start, end],
    }));
  };

  // Obsługa zmian w polach formularza
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Obsługa wysyłania formularza
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Wyszukiwanie:", searchData);
  };

  return (
    <form className="search_form" onSubmit={handleSubmit}>
      {/* Pole wyboru zakresu dat */}
      <div className="form_group">
        <label>Zakres dat:</label>
        <DatePicker
          selected={searchData.dateRange[0]} // Data początkowa
          onChange={handleDateChange}
          startDate={searchData.dateRange[0]} // Data początkowa
          endDate={searchData.dateRange[1]} // Data końcowa
          selectsRange // Umożliwia wybór zakresu dat
          minDate={new Date()} // Blokowanie dat przeszłych
          dateFormat="dd/MM/yyyy"
          className="date_input" // Klasa do stylowania
          isClearable={true} // Pozwala wyczyścić wybór daty
        />
      </div>

      {/* Pole wyboru krajobrazu */}
      <div className="form_group">
        <label htmlFor="category">Krajobraz</label>
        <select
          id="category"
          name="category"
          value={searchData.category}
          onChange={handleInputChange}
          required
        >
          <option value="">Wybierz</option>
          <option value="gory">Góry</option>
          <option value="jezioro">Jezioro</option>
          <option value="morze">Morze</option>
        </select>
      </div>

      {/* Pole lokalizacji */}
      <div className="form_group">
        <label htmlFor="location">Lokalizacja</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Gdzie chcesz pojechać?"
          value={searchData.location}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Pole liczby gości */}
      <div className="form_group">
        <label htmlFor="guests">Goście</label>
        <input
          type="number"
          id="guests"
          name="guests"
          min="1"
          value={searchData.guests}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit" className="btn_search">
        Szukaj
      </button>
    </form>
  );
}

export default Search_form;
