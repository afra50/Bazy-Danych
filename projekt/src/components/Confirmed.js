import React, { useEffect, useState } from "react";
import "../styles/Confirmed.scss";
import axios from "axios";

function Confirmed() {
  const ownerId = sessionStorage.getItem("ownerId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  // Pobieranie potwierdzonych rezerwacji
  useEffect(() => {
    const fetchConfirmedReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/owner/${ownerId}/confirmed-reservations`
        );

        const today = new Date();
        const filteredReservations = response.data.filter((reservation) => {
          const endDate = new Date(reservation.data_do);
          return endDate >= today;
        });

        setReservations(filteredReservations);
      } catch (error) {
        console.error("Błąd podczas pobierania rezerwacji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedReservations();
  }, [ownerId]);

  // Funkcja anulowania rezerwacji
  const handleCancelReservation = async (reservationId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/owner/reject-reservation/${reservationId}`
      );
      // Aktualizacja stanu rezerwacji
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id_rezerwacji !== reservationId
        )
      );
      // Ustawienie powiadomienia
      setNotification("Rezerwacja została odrzucona");

      // Ukrycie powiadomienia po 3 sekundach
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Błąd podczas odrzucania rezerwacji:", error);
    }
  };

  return (
    <section className="confirmed">
      <h3>Potwierdzone</h3>

      {/* Powiadomienie */}
      {notification && <div className="notification">{notification}</div>}

      {loading ? (
        <p>Ładowanie...</p>
      ) : reservations.length === 0 ? (
        <p className="no_reservations">
          <i className="fa-regular fa-calendar-xmark"></i>
          Brak aktualnych potwierdzonych rezerwacji.
          <br />
          Gdy potwierdzisz jakąś rezerwację, pojawi się ona tutaj.
        </p>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id_rezerwacji} className="reservation-item">
              <h4 className="reservation-title">{reservation.nazwa_domku}</h4>
              <p className="reservation-client">
                {reservation.imie_klienta} {reservation.nazwisko_klienta}
              </p>
              <p className="contact">
                Kontakt: {reservation.telefon_klienta}, <br />
                E-mail: {reservation.email_klienta}
              </p>
              <p className="reservation-dates">
                Termin: {new Date(reservation.data_od).toLocaleDateString()} -{" "}
                {new Date(reservation.data_do).toLocaleDateString()}
              </p>
              <p className="reservation-confirm-date">
                Potwierdzono:{" "}
                {new Date(reservation.data_potwierdzenia).toLocaleDateString()}
              </p>
              <p className="reservation-date">
                Data dokonania rezerwacji:{" "}
                {new Date(
                  reservation.data_dokonania_rezerwacji
                ).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() =>
                  handleCancelReservation(reservation.id_rezerwacji)
                }
              >
                Odrzuć rezerwację
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Confirmed;
