import React from "react";
import Waiting from "../../Waiting";
import Confirmed from "../../Confirmed";
import "../../../styles/App.scss";
import "../../../styles/pages/owner/Reservations.scss";

function Reservations() {
  const ownerId = 1; // Przykładowy `ownerId`; w rzeczywistej aplikacji pobierz to z kontekstu lub autoryzacji

  return (
    <main className="reservations">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <h2 className="reservations_header">Rezerwacje moich domków</h2>
      <section className="owner_other_pages">
        <a href="/owner/profile">Profil</a>
        <a href="/owner/myoffers">Moje oferty</a>
      </section>
      <section className="waiting_confirmed">
        <Waiting ownerId={ownerId} />
        <Confirmed ownerId={ownerId} />
      </section>
    </main>
  );
}

export default Reservations;
