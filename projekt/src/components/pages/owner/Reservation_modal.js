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
        <h4>
          <em>{reservation.nazwa_domku}</em>
        </h4>

        {/* Reszta szczegółów w modal-body */}
        <div className="modal-body">
          <p>
            <strong>Klient:</strong>{" "}
            <em>
              {reservation.imie_klienta} {reservation.nazwisko_klienta}
            </em>
          </p>
          <p>
            <strong>Telefon:</strong> <em>{reservation.telefon_klienta}</em>
          </p>
          <p>
            <strong>Email:</strong> <em>{reservation.email_klienta}</em>
          </p>
          <p>
            <strong>Data dokonania rezerwacji:</strong>{" "}
            <em>
              {new Date(
                reservation.data_dokonania_rezerwacji
              ).toLocaleDateString()}
            </em>
          </p>
          <p>
            <strong>Data od:</strong>{" "}
            <em>{new Date(reservation.data_od).toLocaleDateString()}</em>
          </p>
          <p>
            <strong>Data do:</strong>{" "}
            <em>{new Date(reservation.data_do).toLocaleDateString()}</em>
          </p>
        </div>

        {/* Przyciski akcji */}
        <div className="buttons">
          <button onClick={onConfirm} className="confirm-button">
            Potwierdź
          </button>
          <button onClick={onReject} className="reject-button">
            Odrzuć
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationModal;
