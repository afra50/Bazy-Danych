import React from "react";
import "../../../styles/pages/client/My_reservation.scss";

function MyReservations() {
  return (
    <div className="reservation">
       
            <h1>MOJE REZERWACJE</h1>
            <div className="reservation-content">
                <p>do połaczenia z bazą </p>
             </div>
            <div className="reservation-option">
            
                <button>Oferty</button>
                <button>Nadchodzące</button>
            </div> 
              
    </div>
  );
}

export default MyReservations;

