import React, { useEffect, useState } from "react";
import "../styles/Waiting.scss";
import axios from "axios";

function Waiting() {
  // Użycie ownerId z sessionStorage, tak jak w Profile.js
  const ownerId = sessionStorage.getItem("ownerId");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      console.error("Nie znaleziono ID właściciela w sessionStorage");
      setLoading(false);
      return;
    }

    const fetchWaitingReservations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/owner/${ownerId}/waiting-reservations`
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania rezerwacji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingReservations();
  }, [ownerId]);

  return (
    <section className="waiting">
      <h3>Do potwierdzenia</h3>
      {loading ? (
        <p>Ładowanie...</p>
      ) : reservations.length === 0 ? (
        <p>Brak oczekujących rezerwacji do potwierdzenia.</p>
      ) : (
        <ul className="reservations-list">
          {reservations.map((reservation) => (
            <li key={reservation.id_rezerwacji} className="reservation-item">
              <p>
                <strong>Rezerwacja ID:</strong> {reservation.id_rezerwacji}
              </p>
              <p>
                <strong>Domek ID:</strong> {reservation.id_domku}
              </p>
              <p>
                <strong>Klient ID:</strong> {reservation.id_klienta}
              </p>
              <p>
                <strong>Data od:</strong>{" "}
                {new Date(reservation.data_od).toLocaleDateString()}
              </p>
              <p>
                <strong>Data do:</strong>{" "}
                {new Date(reservation.data_do).toLocaleDateString()}
              </p>
              <p>
                <strong>Data dokonania:</strong>{" "}
                {new Date(
                  reservation.data_dokonania_rezerwacji
                ).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <hr />
    </section>
  );
}

export default Waiting;
