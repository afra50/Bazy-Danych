import React, { useState, useEffect } from "react";
import "../../../styles/App.scss"; 
import "../../../styles/pages/client/My_reservation.scss";


function MyReservations() {
  const clientId = sessionStorage.getItem("clientId");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientId) {
      setError("Brak zalogowanego klienta.");
      return;
    }

    fetch(`http://localhost:5000/api/clients/${clientId}/reservations`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd sieci");
        }
        return res.json();
      })
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania rezerwacji klienta:", err);
        setError("Błąd podczas pobierania rezerwacji.");
      });
  }, [clientId]);

  if (error) {
    return (
      <div className="reservations">
        <h1>Moje Rezerwacje</h1>
        <div className="reservation-wrapper">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations">
      <h1>Moje Rezerwacje</h1>
      <div className="reservations-content">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id_rezerwacji} className={`reservation-item highlight-${reservation.status.toLowerCase()}`}
            >
              <h3>Rezerwacja numer {reservation.id_rezerwacji}</h3>
              <div className="elements">
                <p>Domek: {reservation.nazwa_domku}</p>
                <p>Od: {new Date(reservation.data_od).toLocaleDateString()}</p>
                <p>Do: {new Date(reservation.data_do).toLocaleDateString()}</p>
                <p className={`status ${reservation.status.toLowerCase()}`}>
                  Status: {reservation.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Brak rezerwacji.</p>
        )}
      </div>
    </div>
  );
  
}

export default MyReservations;
