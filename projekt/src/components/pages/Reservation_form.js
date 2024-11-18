// Reservation_form.js
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { pl } from "date-fns/locale";
import { format, parseISO } from "date-fns"; // Import do formatowania i parsowania dat
import "react-datepicker/dist/react-datepicker.css"; // Import domyślnych stylów DatePicker
import "../../styles/pages/Reservation_form.scss"; // Import własnych stylów

function Reservation_form() {
  const { id_domku } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const startRaw = searchParams.get("start");
  const endRaw = searchParams.get("end");

  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [id_klienta, setIdKlienta] = useState(null);
  const [images, setImages] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]); // Przedział dat [start, end]
  const [houseLoading, setHouseLoading] = useState(true);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false); // Stan do otwierania i zamykania DatePicker
  const [notification, setNotification] = useState(""); // Stan powiadomienia

  // Obliczenie maksymalnej daty (ostatni dzień piątego pełnego miesiąca w przód)
  const today = new Date();
  const maxMonth = today.getMonth() + 5; // Miesiące są indeksowane od 0
  const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);
  const adjustedMaxMonth = maxMonth % 12;
  const maxDate = new Date(maxYear, adjustedMaxMonth + 1, 0); // Dzień 0 następnego miesiąca to ostatni dzień bieżącego miesiąca

  // Formatuj datę w formacie YYYY-MM-DD
  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  useEffect(() => {
    // Fetchowanie danych klienta
    const fetchClientData = async () => {
      const clientId = sessionStorage.getItem("clientId");
      if (!clientId) {
        setLoading(false);
        return;
      }

      setIdKlienta(clientId);

      try {
        const response = await fetch(
          `http://localhost:5000/api/clients/${clientId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Mapowanie danych API do struktury stanu komponentu
          setClientData({
            firstName: data.imie || "",
            lastName: data.nazwisko || "",
            email: data.email || "",
            phone: data.telefon || "",
          });
        } else {
          const errorData = await response.json();
          console.error(
            "Błąd podczas pobierania danych klienta:",
            errorData.error
          );
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych klienta:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetchowanie zdjęć domku
    const fetchHouseImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/houses/${id_domku}/images`
        );
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          const errorData = await response.json();
          console.error(
            "Błąd podczas pobierania zdjęć domku:",
            errorData.error
          );
        }
      } catch (error) {
        console.error("Błąd podczas pobierania zdjęć domku:", error);
      } finally {
        setHouseLoading(false);
      }
    };

    fetchClientData();
    fetchHouseImages();

    // Ustawienie domyślnego przedziału dat, jeśli podany w URL
    if (startRaw && endRaw) {
      const parsedStart = parseISO(startRaw);
      const parsedEnd = parseISO(endRaw);
      if (!isNaN(parsedStart) && !isNaN(parsedEnd)) {
        setDateRange([parsedStart, parsedEnd]);
      }
    }
  }, [id_domku, startRaw, endRaw]);

  // Efekt do automatycznego ukrywania powiadomienia po 5 sekundach
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer); // Sprzątanie timera
    }
  }, [notification]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id_klienta) {
      alert(
        "Nie jesteś zalogowany/a. Proszę się zalogować przed dokonaniem rezerwacji."
      );
      return;
    }

    const [start, end] = dateRange;

    // Sprawdzenie, czy oba daty zostały wybrane
    if (!start || !end) {
      alert("Proszę wybrać przedział dat.");
      return;
    }

    // Formatowanie dat
    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);

    const reservationData = {
      id_domku,
      id_klienta,
      start: formattedStartDate,
      end: formattedEndDate,
    };

    console.log("Dane do wysłania:", reservationData); // Logowanie

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        alert("Rezerwacja została pomyślnie złożona!");
        navigate("/client/reservations"); // Przekierowanie po złożeniu rezerwacji
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Wystąpił problem z rezerwacją.");
      }
    } catch (error) {
      console.error("Błąd podczas składania rezerwacji:", error);
      alert("Nie udało się złożyć rezerwacji.");
    }
  };

  if (loading || houseLoading) {
    return <p>Ładowanie danych...</p>;
  }

  return (
    <div className="reservation-container">
      <h1>Nowa Rezerwacja</h1>
      <div className="reservation-content">
        {/* Sekcja z obrazem domku */}
        <div className="house-image">
          {images.length > 0 ? (
            <img src={images[0]} alt="Domek" />
          ) : (
            <p>Brak dostępnych zdjęć domku.</p>
          )}
        </div>

        {/* Formularz rezerwacji */}
        <form onSubmit={handleSubmit} className="reservation-form">
          {/* Pola danych klienta jako tylko do odczytu */}
          <div className="form-group">
            <label>Imię:</label>
            <input
              type="text"
              value={clientData.firstName}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label>Nazwisko:</label>
            <input
              type="text"
              value={clientData.lastName}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={clientData.email}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label>Telefon:</label>
            <input
              type="tel"
              value={clientData.phone}
              disabled
              className="disabled-input"
            />
          </div>

          {/* Ukryte pola dla id_domku i id_klienta */}
          <input type="hidden" name="id_domku" value={id_domku} />
          <input type="hidden" name="id_klienta" value={id_klienta} />

          {/* Pole do wyboru przedziału dat */}
          <div className="form-group">
            <label>Przedział dat:</label>
            <DatePicker
              selected={dateRange[0]} // Początek zakresu
              onChange={(dates) => setDateRange(dates)} // Aktualizacja stanu
              startDate={dateRange[0]} // Początek zakresu
              endDate={dateRange[1]} // Koniec zakresu
              selectsRange // Umożliwia wybór przedziału dat
              minDate={today} // Minimalna data to dzisiaj
              maxDate={maxDate} // Maksymalna data
              dateFormat="dd/MM/yyyy"
              className="date_input"
              placeholderText="Wybierz przedział dat"
              isClearable={true}
              locale={pl}
              onCalendarOpen={() => setDatePickerOpen(true)}
              onCalendarClose={() => setDatePickerOpen(false)}
              calendarClassName={isDatePickerOpen ? "open" : ""}
              popperPlacement="bottom-start" // Pozycjonowanie kalendarza
            />
          </div>

          <button type="submit" className="submit-button">
            Złóż rezerwację
          </button>
        </form>
      </div>

      {/* Renderowanie powiadomienia */}
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default Reservation_form;
