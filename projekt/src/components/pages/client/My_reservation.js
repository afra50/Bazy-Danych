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

  const cancelReservation = (reservationId) => {
    if (!window.confirm("Czy na pewno chcesz anulować tę rezerwację?")) {
      return;
    }
  
    fetch(`http://localhost:5000/api/reservations/${reservationId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Nie udało się anulować rezerwacji.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Odpowiedź z serwera:", data);  // Dodaj logowanie odpowiedzi
        if (data.message) {
          // Usuń rezerwację z listy po jej anulowaniu
          setReservations((prev) =>
            prev.filter((reservation) => reservation.id_rezerwacji !== reservationId)
          );
          alert(data.message);  // Pokazanie komunikatu, jeśli rezerwacja została anulowana
        } else {
          alert("Brak komunikatu o sukcesie.");
        }
      })
      .catch((err) => {
        console.error("Błąd podczas anulowania rezerwacji:", err);
        alert("Nie udało się anulować rezerwacji.");
      });
  };
  return (
    <div className="reservations">
      <h1>Moje Rezerwacje</h1>
      <div className="reservations-content">
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div 
              key={reservation.id_rezerwacji} 
              className={`reservation-item highlight-${reservation.status.toLowerCase()}`}
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
              <button
                className="cancel-btn"
                onClick={() => cancelReservation(reservation.id_rezerwacji)}
              >
                Anuluj rezerwację
              </button>
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
