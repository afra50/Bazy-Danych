import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { pl } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/pages/Reservation_form.scss";

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

  const [houseName, setHouseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [id_klienta, setIdKlienta] = useState(null);
  const [images, setImages] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [houseLoading, setHouseLoading] = useState(true);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const today = new Date();
  const maxMonth = today.getMonth() + 5;
  const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);
  const adjustedMaxMonth = maxMonth % 12;
  const maxDate = new Date(maxYear, adjustedMaxMonth + 1, 0);

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  useEffect(() => {
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

    const fetchHouseData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/houses/${id_domku}`
        );
        if (response.ok) {
          const data = await response.json();
          setHouseName(data.nazwa);
        } else {
          console.error("Błąd podczas pobierania danych domku");
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych domku:", error);
      }
    };

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
    fetchHouseData();
    fetchHouseImages();

    if (startRaw && endRaw) {
      const parsedStart = parseISO(startRaw);
      const parsedEnd = parseISO(endRaw);
      if (!isNaN(parsedStart) && !isNaN(parsedEnd)) {
        setDateRange([parsedStart, parsedEnd]);
      }
    }
  }, [id_domku, startRaw, endRaw]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer);
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

    if (!start || !end) {
      setNotification("Proszę wybrać przedział dat.");
      return;
    }

    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);

    const reservationData = {
      id_domku,
      id_klienta,
      start: formattedStartDate,
      end: formattedEndDate,
    };

    console.log("Dane do wysłania:", reservationData);

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setNotification("Rezerwacja została pomyślnie złożona!");
        setTimeout(() => {
          navigate("/client/reservations");
        }, 3000);
      } else {
        const errorData = await response.json();
        setNotification(errorData.error || "Wystąpił problem z rezerwacją.");
      }
    } catch (error) {
      console.error("Błąd podczas składania rezerwacji:", error);
      setNotification("Nie udało się złożyć rezerwacji.");
    }
  };

  if (loading || houseLoading) {
    return <p>Ładowanie danych...</p>;
  }

  return (
    <div className="reservation-container">
      <div className="reservation-content">
        <div className="house-image">
          {images.length > 0 ? (
            <>
              <img src={images[0]} alt="Domek" />
              <div className="overlay">{houseName}</div> {/* Nazwa domku */}
            </>
          ) : (
            <p>Brak dostępnych zdjęć domku.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          <h1 className="form-title">Nowa Rezerwacja</h1>
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
            <label>E-mail:</label>
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
          <div className="form-group infotip">
            <i class="fa-solid fa-circle-info"></i>
            <span>
              Aby zmienić dane rezerwacji, zaktualizuj je w swoim Profilu.
            </span>
          </div>

          <input type="hidden" name="id_domku" value={id_domku} />
          <input type="hidden" name="id_klienta" value={id_klienta} />

          <div className="form-group">
            <label>Wybrane daty:</label>
            <DatePicker
              selected={dateRange[0]}
              onChange={(dates) => setDateRange(dates)}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              selectsRange
              minDate={today}
              maxDate={maxDate}
              dateFormat="dd/MM/yyyy"
              className="date_input"
              placeholderText="Wybierz przedział dat"
              isClearable={true}
              locale={pl}
              onCalendarOpen={() => setDatePickerOpen(true)}
              onCalendarClose={() => setDatePickerOpen(false)}
              calendarClassName={isDatePickerOpen ? "open" : ""}
              popperPlacement="bottom-start"
            />
          </div>

          <button type="submit" className="submit-button">
            Złóż rezerwację
          </button>
        </form>
      </div>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default Reservation_form;