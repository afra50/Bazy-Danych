import React, { useState, useEffect, useRef } from "react";
import "../../../styles/pages/owner/Profile.scss";
import "../../../styles/App.scss";

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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [file, setFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Dodajemy referencję do textarea
  const textareaRef = useRef(null);

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

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setOwnerData((prevData) => ({ ...prevData, opis: value }));

    // Dostosowujemy wysokość textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Resetujemy wysokość
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // Ustawiamy wysokość na podstawie zawartości
    }
  };

  const handleDescriptionSave = () => {
    fetch(`http://localhost:5000/owner/profile/update/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...ownerData,
      }),
    })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
        setIsEditingDescription(false);
      })
      .catch((err) => console.error("Błąd podczas aktualizacji opisu:", err));
  };

  // Używamy useEffect, aby dostosować wysokość podczas wejścia w tryb edycji
  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Resetujemy wysokość
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // Ustawiamy wysokość na podstawie zawartości
    }
  }, [isEditingDescription]);

  return (
    <section className="Owner_profile">
      <span className="back">
        <i class="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <h2>Profil właściciela</h2>
      <div className="profile-container">
        {/* Lewa część: Profile Info i Edycja Danych */}
        <div className="profile-left">
          <img
            src={`http://localhost:5000${
              ownerData.zdjecie
                ? ownerData.zdjecie
                : "/uploads/default_profile.png"
            }`}
            alt={`${ownerData.imie} ${ownerData.nazwisko}`}
            className="profile-img"
            onClick={() => setShowEditModal(true)}
          />
          <div className="profile-info">
            <h3>
              {ownerData.imie} {ownerData.nazwisko}
            </h3>
            <p>Email: {ownerData.email}</p>
            <p>Telefon: {ownerData.telefon}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edytuj dane
          </button>

          {isEditing && (
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
              <button type="submit" className="edit-button">
                Zapisz zmiany
              </button>
            </form>
          )}
        </div>

        {/* Prawa część: Opis */}
        <div className="profile-right">
          <p className="about_me">O mnie:</p>
          <div className="profile-description">
            {isEditingDescription ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={ownerData.opis}
                  onChange={handleDescriptionChange}
                  className="editable-textarea"
                />
                <div className="buttons">
                  <button
                    onClick={handleDescriptionSave}
                    className="save-button"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setIsEditingDescription(false)}
                    className="cancel-button"
                  >
                    Anuluj
                  </button>
                </div>
              </>
            ) : (
              <p onClick={handleDescriptionClick} className="description-text">
                {ownerData.opis || "Brak opisu."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal edycji zdjęcia */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowEditModal(false)}
              className="close-button"
            >
              &times;
            </button>
            <h3>Zaktualizuj zdjęcie</h3>
            <form onSubmit={handleFileSubmit} className="file-upload-form">
              <label>
                Wybierz nowe zdjęcie:
                <input type="file" onChange={handleFileChange} />
              </label>
              <button type="submit">Prześlij zdjęcie</button>
            </form>
          </div>
        </div>
      )}
      <section className="owner_other_pages">
        <a href="/owner/myoffers">Moje oferty</a>
        <a href="/owner/reservations">Rezerwacje</a>
      </section>
    </section>
  );
}

export default Profile;
