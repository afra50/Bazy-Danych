import React, { useState, useEffect } from "react";
import "../../../styles/App.scss";

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
        console.log("Otrzymane dane:", data);  
        setReservations(data);  
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania rezerwacji klienta:", err);
        setError("Błąd podczas pobierania rezerwacji.");
      });
  }, [clientId]);  // Używamy clientId jako zależności, aby wykonać zapytanie po zmianie clientId

  if (error) {
    return (
      <div className="reservations">
        <h1>Moje Rezerwacje</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="reservations">
      <h1>Moje Rezerwacje</h1>
      <div className="reservations-content">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id_rezerwacji} className="reservation-item">
              <h3>Rezerwacja #{reservation.id_rezerwacji}</h3>
              <p>Domek: {reservation.nazwa_domku}</p>
              <p>Od: {new Date(reservation.data_od).toLocaleDateString()}</p>
              <p>Do: {new Date(reservation.data_do).toLocaleDateString()}</p>
              <p>Status: {reservation.status}</p>
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
