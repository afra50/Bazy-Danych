import React, { useState, useEffect } from "react";
import Waiting from "../../Waiting";
import Confirmed from "../../Confirmed";
import "../../../styles/pages/owner/Reservations.scss";
import axios from "axios";

function Reservations() {
  const ownerId = sessionStorage.getItem("ownerId");
  const [waitingReservations, setWaitingReservations] = useState([]);
  const [confirmedReservations, setConfirmedReservations] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState("");

  const refreshReservations = async () => {
    try {
      const waitingRes = await axios.get(
        `http://localhost:5000/api/owner/${ownerId}/waiting-reservations`
      );
      setWaitingReservations(waitingRes.data);

      const confirmedRes = await axios.get(
        `http://localhost:5000/api/owner/${ownerId}/confirmed-reservations`
      );
      setConfirmedReservations(confirmedRes.data);
    } catch (error) {
      console.error("Błąd podczas pobierania rezerwacji:", error);
    }
  };

  useEffect(() => {
    refreshReservations();
  }, [ownerId]);

  const handleConfirmReservation = async (reservationId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/owner/confirm-reservation/${reservationId}`
      );
      setNotification("Rezerwacja została potwierdzona.");
      await refreshReservations();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Błąd podczas potwierdzania rezerwacji:", error);
    }
  };

  const handleRejectReservation = async (reservationId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/owner/reject-reservation/${reservationId}`
      );
      setNotification("Rezerwacja została odrzucona.");
      await refreshReservations();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Błąd podczas odrzucania rezerwacji:", error);
    }
  };

  // Ukrycie powiadomienia po kilku sekundach
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <main className="reservations">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <h2 className="reservations_header">Rezerwacje moich domków</h2>

      {notification && <div className="notification">{notification}</div>}

      <section className="owner_other_pages">
        <a href="/owner/profile">Profil</a>
        <a href="/owner/myoffers">Moje oferty</a>
      </section>
      <section className="waiting_confirmed">
        <Waiting
          reservations={waitingReservations}
          onConfirmReservation={handleConfirmReservation}
          onRejectReservation={handleRejectReservation}
        />
        <Confirmed key={refreshKey} reservations={confirmedReservations} />
      </section>
    </main>
  );
}

export default Reservations;
