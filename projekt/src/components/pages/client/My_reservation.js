import React from "react";
import "../../../styles/pages/client/My_reservation.scss";

function MyReservations() {
  return (
    <div className="reservation">
      <h1>MOJE REZERWACJE</h1>
      <div className="reservation-content">
        <p>......[*] </p>
      </div>

      <div className="reservation-option">
        <h2>Opcje</h2>
        <a href="/offers">Oferty</a>
        <a href="incoming">Nadchodzące</a>
      </div>
    </div>
  );
}

export default MyReservations;