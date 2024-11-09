import React, { useEffect, useState } from "react";
import "../styles/Confirmed.scss";
import axios from "axios";

function Confirmed() {
  const ownerId = sessionStorage.getItem("ownerId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      console.error("Nie znaleziono ID właściciela w sessionStorage");
      setLoading(false);
      return;
    }

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

  return (
    <section className="confirmed">
      <h3>Potwierdzone</h3>
      {loading ? (
        <p>Ładowanie...</p>
      ) : reservations.length === 0 ? (
        <p className="no_reservations">
          <i className="fa-regular fa-calendar-xmark"></i>
          Brak aktualnych potwierdzonych rezerwacji.<br></br>
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Confirmed;
