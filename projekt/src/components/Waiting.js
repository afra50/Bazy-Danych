import React, { useState } from "react";
import axios from "axios";
import "../styles/Waiting.scss";
import ReservationModal from "./pages/owner/Reservation_modal";

function Waiting({ reservations, onConfirmReservation, onRejectReservation }) {
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleConfirm = () => {
    if (selectedReservation) {
      onConfirmReservation(selectedReservation.id_rezerwacji);
      setSelectedReservation(null); // Zamknięcie okna modalnego
    }
  };

  const handleReject = async () => {
    if (selectedReservation) {
      try {
        await axios.patch(
          `http://localhost:5000/api/owner/reject-reservation/${selectedReservation.id_rezerwacji}`
        );
        onRejectReservation(selectedReservation.id_rezerwacji);
      } catch (error) {
        console.error("Błąd podczas odrzucania rezerwacji:", error);
      }
      setSelectedReservation(null);
    }
  };

  return (
    <section className="waiting">
      <h3>Do potwierdzenia</h3>
      {reservations.length === 0 ? (
        <p className="no_reservations">
          <i className="fa-regular fa-calendar-xmark"></i>
          Brak oczekujących rezerwacji do potwierdzenia.<br></br>
          Gdy ktoś zarezerwuje Twój domek, będziesz mógł tutaj to potwierdzić.
        </p>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div
              key={reservation.id_rezerwacji}
              className="reservation-item"
              onClick={() => setSelectedReservation(reservation)}
            >
              <h4 className="reservation-title">{reservation.nazwa_domku}</h4>
              <p className="reservation-client">
                {reservation.imie_klienta} {reservation.nazwisko_klienta}
              </p>
              <p className="reservation-dates">
                Termin: {new Date(reservation.data_od).toLocaleDateString()} -{" "}
                {new Date(reservation.data_do).toLocaleDateString()}
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

      <ReservationModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
      <hr />
    </section>
  );
}

export default Waiting;
