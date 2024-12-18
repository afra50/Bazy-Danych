import React, { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
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
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedOpis, setEditedOpis] = useState("");
  const [file, setFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorScale, setEditorScale] = useState(1);
  const [image, setImage] = useState(null);
  const editorRef = useRef(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (!ownerId) {
      console.error("Nie znaleziono ID właściciela w sessionStorage");
      return;
    }

    fetch(`http://localhost:5000/api/owner/profile/${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        setOwnerData(data);
      })
      .catch((err) => console.error("Błąd podczas pobierania danych:", err));
  }, [ownerId]);

  const handleEditClick = () => {
    setEditedData(ownerData);
    setIsEditing(true);
  };

  const handleEditedInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileUpdateSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/owner/profile/update/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imie: editedData.imie,
        nazwisko: editedData.nazwisko,
        telefon: editedData.telefon,
        email: editedData.email,
        opis: editedData.opis,
      }),
    })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
        setOwnerData(editedData);
        setIsEditing(false);
      })
      .catch((err) => console.error("Błąd podczas aktualizacji danych:", err));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setEditorOpen(true);
    } else {
      alert("Proszę wybrać plik obrazu (JPEG, JPG, PNG lub GIF).");
      e.target.value = "";
      setFile(null);
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Wybierz zdjęcie");
      return;
    }

    setImage(URL.createObjectURL(file));
    setEditorOpen(true);
  };

  const handleSaveAvatar = () => {
    if (editorRef.current) {
      editorRef.current.getImageScaledToCanvas().toBlob((blob) => {
        const formData = new FormData();
        formData.append("zdjecie", blob, "avatar.png");

        fetch(`http://localhost:5000/api/owner/upload/${ownerId}`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.text())
          .then(() => {
            alert("Zdjęcie zostało zaktualizowane");
            setEditorOpen(false);
            window.location.reload();
          })
          .catch((err) =>
            console.error("Błąd podczas przesyłania zdjęcia:", err)
          );
      }, "image/png");
    }
  };

  const handleDescriptionClick = () => {
    setEditedOpis(ownerData.opis);
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setEditedOpis(value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleDescriptionSave = () => {
    fetch(`http://localhost:5000/api/owner/profile/${ownerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        opis: editedOpis,
      }),
    })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
        setOwnerData((prevData) => ({ ...prevData, opis: editedOpis }));
        setIsEditingDescription(false);
      })
      .catch((err) => console.error("Błąd podczas aktualizacji opisu:", err));
  };

  const handleDescriptionCancel = () => {
    setIsEditingDescription(false);
    setEditedOpis("");
  };

  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [isEditingDescription]);

  return (
    <section className="Owner_profile">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/">Wróć do strony głównej</a>
      </span>
      <h2>Profil właściciela</h2>
      <div className="profile-container">
        <div className="profile-left">
          <div
            className="profile-img-container"
            onClick={() => setShowEditModal(true)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${
                ownerData.zdjecie
                  ? ownerData.zdjecie
                  : "/uploads/default_profile.png"
              }`}
              alt={`${ownerData.imie} ${ownerData.nazwisko}`}
              className="profile-img"
            />
            <div className="overlay">
              <i className="fa-solid fa-camera"></i>
            </div>
          </div>
          <div className="profile-info">
            <h3>
              {ownerData.imie} {ownerData.nazwisko}
            </h3>
            <p>Email: {ownerData.email}</p>
            <p>Telefon: {ownerData.telefon}</p>
          </div>
          <button onClick={handleEditClick} className="edit-button">
            Edytuj dane
          </button>
        </div>

        <div className="profile-right">
          <p className="about_me">O mnie:</p>
          <div className="profile-description">
            {isEditingDescription ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={editedOpis}
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
                    onClick={handleDescriptionCancel}
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

      {/* Modal edycji danych */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setIsEditing(false)}
              className="close-button"
            >
              &times;
            </button>
            <h3>Edytuj dane</h3>
            <form onSubmit={handleProfileUpdateSubmit}>
              <div>
                <label>Imię:</label>
                <input
                  type="text"
                  name="imie"
                  value={editedData.imie}
                  onChange={handleEditedInputChange}
                />
              </div>
              <div>
                <label>Nazwisko:</label>
                <input
                  type="text"
                  name="nazwisko"
                  value={editedData.nazwisko}
                  onChange={handleEditedInputChange}
                />
              </div>
              <div>
                <label>Telefon:</label>
                <input
                  type="text"
                  name="telefon"
                  maxLength="9"
                  required
                  value={editedData.telefon}
                  onChange={handleEditedInputChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleEditedInputChange}
                />
              </div>
              <div className="buttons">
                <button type="submit" className="save-button">
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal edycji zdjęcia */}
      {editorOpen ? (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setEditorOpen(false)}
              className="close-button"
            >
              &times;
            </button>
            <h3>Edytuj swoje zdjęcie</h3>
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={250}
              height={250}
              border={50}
              borderRadius={125}
              color={[0, 0, 0, 0.6]}
              scale={editorScale}
            />
            <div className="slider-container">
              <label htmlFor="scale">Zoom:</label>
              <input
                type="range"
                id="scale"
                name="scale"
                min="1"
                max="3"
                step="0.01"
                value={editorScale}
                onChange={(e) => setEditorScale(parseFloat(e.target.value))}
              />
            </div>
            <button onClick={handleSaveAvatar} className="save-button">
              Zapisz
            </button>
          </div>
        </div>
      ) : (
        showEditModal && (
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
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                <button type="submit">Prześlij zdjęcie</button>
              </form>
            </div>
          </div>
        )
      )}
      <section className="owner_other_pages">
        <a href="/owner/myoffers">Moje oferty</a>
        <a href="/owner/reservations">Rezerwacje</a>
      </section>
    </section>
  );
}

export default Profile;
