import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "../../styles/pages/Reservation_form.scss";

function Reservation_form() {
  const { id_domku } = useParams();
  const [searchParams] = useSearchParams();

  const startDateRaw = searchParams.get("start");
  const endDateRaw = searchParams.get("end");

  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // Formatuj daty w formacie YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startDate = startDateRaw ? formatDate(startDateRaw) : "";
  const endDate = endDateRaw ? formatDate(endDateRaw) : "";

  useEffect(() => {
    const fetchClientData = async () => {
      const clientId = sessionStorage.getItem("clientId");
      if (!clientId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/clients/${clientId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Mapowanie danych API do struktury stanu komponentu
          setClientData({
            firstName: data.imie || "", // Dopasowanie nazwy klucza
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

    fetchClientData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const reservationData = {
      id_domku,
      start: formData.get("start"),
      end: formData.get("end"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        alert("Rezerwacja została pomyślnie złożona!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Wystąpił problem z rezerwacją.");
      }
    } catch (error) {
      console.error("Błąd podczas składania rezerwacji:", error);
      alert("Nie udało się złożyć rezerwacji.");
    }
  };

  if (loading) {
    return <p>Ładowanie danych...</p>;
  }

  return (
    <div className="reservation-container">
      <h1>Formularz rezerwacji dla domku {id_domku}</h1>
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-group">
          <label>Data początkowa:</label>
          <input
            type="date"
            name="start"
            defaultValue={startDate}
            required={!startDate}
          />
        </div>
        <div className="form-group">
          <label>Data końcowa:</label>
          <input
            type="date"
            name="end"
            defaultValue={endDate}
            required={!endDate}
          />
        </div>
        <div className="form-group">
          <label>Imię:</label>
          <input
            type="text"
            name="firstName"
            value={clientData.firstName}
            onChange={(e) =>
              setClientData({ ...clientData, firstName: e.target.value })
            }
            placeholder="Wprowadź imię"
            required
          />
        </div>
        <div className="form-group">
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={clientData.lastName}
            onChange={(e) =>
              setClientData({ ...clientData, lastName: e.target.value })
            }
            placeholder="Wprowadź nazwisko"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={clientData.email}
            onChange={(e) =>
              setClientData({ ...clientData, email: e.target.value })
            }
            placeholder="Wprowadź adres e-mail"
            required
          />
        </div>
        <div className="form-group">
          <label>Telefon:</label>
          <input
            type="tel"
            name="phone"
            value={clientData.phone}
            onChange={(e) =>
              setClientData({ ...clientData, phone: e.target.value })
            }
            placeholder="Wprowadź numer telefonu"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Złóż rezerwację
        </button>
      </form>
    </div>
  );
}

export default Reservation_form;
