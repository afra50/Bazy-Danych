import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Owner_details.scss";

function Owner_details({ houseId }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const defaultImagePath = "/uploads/default_profile.png";

  useEffect(() => {
    if (!houseId) return; // Jeśli brak ID, nie wysyłaj żądania

    axios
      .get(`${API_URL}/api/houses/${houseId}/owner`)
      .then((response) => {
        setOwner(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Nie udało się pobrać danych właściciela.");
        setLoading(false);
      });
  }, [houseId, API_URL]);

  if (loading) {
    return <p>Ładowanie danych właściciela...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Funkcja do sprawdzania, czy URL obrazu jest prawidłowy
  const isValidImageUrl = (url) => {
    if (!url) return false;
    return !url.toLowerCase().includes("null");
  };

  const imageUrl = isValidImageUrl(owner.zdjecie)
    ? owner.zdjecie
    : `${API_URL}${defaultImagePath}`;

  const handleImageError = (e) => {
    e.target.src = `${API_URL}${defaultImagePath}`;
  };

  return (
    <div className="owner_section">
      <h2>Gospodarz</h2>
      <img
        src={imageUrl}
        alt={`Zdjęcie właściciela: ${owner.imie}`}
        style={{ width: "150px", borderRadius: "50%" }}
        onError={handleImageError}
      />
      <p className="owner_name">{owner.imie}</p>
      <p className="owner_contact">
        <span className="contact_title">Skontaktuj się</span>
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
      <p className="owner_description">{owner.opis}</p>
    </div>
  );
}

export default Owner_details;
