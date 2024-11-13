import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Owner_details.scss";

function Owner_details({ houseId }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!houseId) return; // Jeśli brak ID, nie wysyłaj żądania

    // Zaktualizowany URL z nową ścieżką
    axios
      .get(`http://localhost:5000/api/houses/${houseId}/owner`)
      .then((response) => {
        setOwner(response.data); // Ustaw dane właściciela
        setLoading(false);
      })
      .catch((err) => {
        setError("Nie udało się pobrać danych właściciela."); // Obsługa błędów
        setLoading(false);
      });
  }, [houseId]);

  if (loading) {
    return <p>Ładowanie danych właściciela...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="owner_section">
      <h2>Gospodarz</h2>
      <img
        src={owner.zdjecie}
        alt={`Zdjęcie właściciela: ${owner.imie}`}
        style={{ width: "150px", borderRadius: "50%" }}
      />
      <p className="owner_name">{owner.imie}</p>
      <p className="owner_description">{owner.opis}</p>
      <p className="owner_contact">
        <span className="contact_title">Skontaktuj się z gospodarzem</span>
        <div>
          <span>Telefon: </span>
          <em>
            <span>{owner.telefon}</span>
          </em>
        </div>
        <div>
          <span>E-mail: </span>
          <em>
            <span>{owner.email}</span>
          </em>
        </div>
      </p>
    </div>
  );
}

export default Owner_details;
