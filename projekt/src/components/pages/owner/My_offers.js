import React, { useEffect, useState } from "react";
import "../../../styles/pages/owner/My_offers.scss";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Funkcja do pobierania domków
const fetchHouses = async (ownerId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/owner/${ownerId}/houses`
    );
    if (!response.ok) {
      throw new Error("Nie udało się pobrać ofert");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Funkcja do sprawdzania, czy data jest niedostępna
const fetchUnavailableDates = async (houseId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/houses/${houseId}/availability`
    );
    if (!response.ok) {
      throw new Error("Nie udało się pobrać dostępności");
    }
    const data = await response.json();
    return data; // Zakłada, że data ma postać [{ data_od, data_do }]
  } catch (error) {
    console.error(error);
    return [];
  }
};

function My_offers() {
  const ownerId = sessionStorage.getItem("ownerId");
  const [houses, setHouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const today = new Date();
  const maxMonth = today.getMonth() + 5;
  const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);
  const adjustedMaxMonth = maxMonth % 12;
  const maxDate = new Date(maxYear, adjustedMaxMonth + 1, 0);

  useEffect(() => {
    const loadHouses = async () => {
      const housesData = await fetchHouses(ownerId);
      setHouses(housesData);
    };
    loadHouses();
  }, [ownerId]);

  const openModal = (house) => {
    setSelectedHouse(house);
    setIsModalOpen(true);
    // Pobranie niedostępnych dat dla wybranego domku
    const loadUnavailableDates = async () => {
      const unavailable = await fetchUnavailableDates(house.id_domku);
      setUnavailableDates(unavailable);
    };
    loadUnavailableDates();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHouse(null);
  };

  // Funkcja sprawdzająca, czy data jest niedostępna
  const isDateUnavailable = (date) => {
    return unavailableDates.some((range) => {
      const start = new Date(range.data_od);
      const end = new Date(range.data_do);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  // Funkcja do wyłączania niedostępnych dat w kalendarzu
  const tileDisabled = ({ date }) => {
    const minDate = new Date();
    return date < minDate || date > maxDate || isDateUnavailable(date);
  };

  // Funkcja do obsługi zmiany aktywnego miesiąca
  const onActiveStartDateChange = ({ activeStartDate }) => {
    if (activeStartDate > maxDate) {
      setActiveStartDate(maxDate);
    } else {
      setActiveStartDate(activeStartDate);
    }
  };

  return (
    <main className="myoffers">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <h2 className="myoffers_header">Moje oferty</h2>
      <section className="owner_other_pages">
        <a href="/owner/profile">Profil</a>
        <a href="/owner/reservations">Rezerwacje</a>
      </section>

      <div className="myoffers_container">
        {houses.length === 0 ? (
          <p className="no_offers">
            <i className="fa-solid fa-house-circle-xmark"></i>
            Aktualnie nie masz ofert swoich domków.
          </p>
        ) : (
          <div className="houses">
            {houses.map((house) => (
              <div
                key={house.id_domku}
                className="house-card"
                onClick={() => openModal(house)}
              >
                <div className="image-wrapper">
                  <img
                    src={`http://localhost:5000/domki/${house.id_domku}/${house.id_domku}_1.jpg`}
                    alt={house.nazwa}
                    className="house-image"
                  />
                </div>
                <h3>{house.nazwa}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal z informacjami o domku */}
      {isModalOpen && selectedHouse && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedHouse.nazwa}</h2>
            {/* Zdjęcie w modalu */}
            <div className="image-wrapper">
              <img
                src={`http://localhost:5000/domki/${selectedHouse.id_domku}/${selectedHouse.id_domku}_1.jpg`}
                alt={selectedHouse.nazwa}
              />
            </div>
            <p>{selectedHouse.opis}</p>
            <div className="house-details">
              <p>
                <strong>Liczba osób:</strong> {selectedHouse.liczba_osob}
              </p>
              <p>
                <strong>Kategoria:</strong> {selectedHouse.kategoria}
              </p>
              <p>
                <strong>Lokalizacja:</strong> {selectedHouse.lokalizacja}
              </p>
              <p>
                <strong>Cena za noc:</strong> {selectedHouse.cena_za_noc} PLN
              </p>
            </div>
            <h3 className="calendar_title">Kalendarz dostępności</h3>
            <div className="calendar">
              <Calendar
                view="month"
                minDetail="month"
                maxDetail="month"
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={false}
                onChange={null}
                selectRange={false}
                tileDisabled={tileDisabled}
                minDate={today}
                maxDate={maxDate}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={onActiveStartDateChange}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default My_offers;
