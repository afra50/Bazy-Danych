import React, { useState, useEffect } from "react";

function Profile() {
  const ownerId = sessionStorage.getItem("ownerId");
  const [ownerData, setOwnerData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    telefon: "",
    opis: "",
    zdjecie: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!ownerId) {
      console.error("Nie znaleziono ID właściciela w sessionStorage");
      return;
    }

    fetch(`http://localhost:5000/owner/profile/${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        setOwnerData(data);
      })
      .catch((err) => console.error("Błąd podczas pobierania danych:", err));
  }, [ownerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOwnerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileUpdateSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/owner/profile/update/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imie: ownerData.imie,
        nazwisko: ownerData.nazwisko,
        telefon: ownerData.telefon,
        email: ownerData.email,
        opis: ownerData.opis,
      }),
    })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
        setIsEditing(false);
      })
      .catch((err) => console.error("Błąd podczas aktualizacji danych:", err));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Wybierz zdjęcie");
      return;
    }

    const formData = new FormData();
    formData.append("zdjecie", file);

    fetch(`http://localhost:5000/owner/upload/${ownerId}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then(() => {
        alert("Zdjęcie zostało zaktualizowane");
        window.location.reload();
      })
      .catch((err) => console.error("Błąd podczas przesyłania zdjęcia:", err));
  };

  return (
    <div>
      <h2>Profil właściciela</h2>
      <img
        src={`http://localhost:5000${
          ownerData.zdjecie ? ownerData.zdjecie : "/uploads/default_profile.png"
        }`}
        alt={`${ownerData.imie} ${ownerData.nazwisko}`}
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        onError={(e) => {
          // Jeśli zdjęcie nie zostanie znalezione, ustaw domyślne zdjęcie
          e.target.src = "http://localhost:5000/uploads/default_profile.png";
        }}
      />
      <h3>
        {ownerData.imie} {ownerData.nazwisko}
      </h3>
      <p>Email: {ownerData.email}</p>
      <p>Telefon: {ownerData.telefon}</p>

      <div>
        <p>
          <strong>Opis:</strong>
        </p>
        <p>{ownerData.opis || "Brak opisu."}</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleProfileUpdateSubmit}>
          <div>
            <label>Imię:</label>
            <input
              type="text"
              name="imie"
              value={ownerData.imie}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Nazwisko:</label>
            <input
              type="text"
              name="nazwisko"
              value={ownerData.nazwisko}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Telefon:</label>
            <input
              type="text"
              name="telefon"
              value={ownerData.telefon}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={ownerData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Opis:</label>
            <textarea
              name="opis"
              value={ownerData.opis}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Zapisz zmiany</button>
        </form>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edytuj dane</button>
      )}

      <form onSubmit={handleFileSubmit}>
        <label>
          Zaktualizuj zdjęcie:
          <input type="file" onChange={handleFileChange} />
        </label>
        <button type="submit">Prześlij zdjęcie</button>
      </form>
    </div>
  );
}

export default Profile;
