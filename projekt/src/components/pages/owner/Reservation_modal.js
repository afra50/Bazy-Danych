import React from "react";
import "../../../styles/pages/owner/Reservation_modal.scss";

function ReservationModal({ reservation, onClose, onConfirm, onReject }) {
  if (!reservation) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-reservation-button">
          &times;
        </button>

        {/* Nazwa domku na samej górze */}
        <h4>{reservation.nazwa_domku}</h4>

        {/* Reszta szczegółów w modal-body */}
        <div className="modal-body">
          <p>
            <strong>Klient:</strong> {reservation.imie_klienta}{" "}
            {reservation.nazwisko_klienta}
          </p>
          <p>
            <strong>Telefon:</strong> {reservation.telefon_klienta}
          </p>
          <p>
            <strong>Email:</strong> {reservation.email_klienta}
          </p>
          <p>
            <strong>Data dokonania rezerwacji:</strong>{" "}
            {new Date(
              reservation.data_dokonania_rezerwacji
            ).toLocaleDateString()}
          </p>
          <p>
            <strong>Data przyjazdu:</strong>{" "}
            {new Date(reservation.data_od).toLocaleDateString()}
          </p>
          <p>
            <strong>Data wyjazdu:</strong>{" "}
            {new Date(reservation.data_do).toLocaleDateString()}
          </p>
        </div>

        {/* Przyciski akcji */}
        <div className="buttons">
          <button onClick={onConfirm} className="confirm-button">
            Potwierdź
          </button>
          <button onClick={onReject} className="reject-button">
            Odrzuć rezerwację
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationModal;
