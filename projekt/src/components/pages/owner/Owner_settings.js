import React, { useState, useEffect } from "react";
import "../../../styles/pages/owner/Owner_settings.scss";
import { Link } from "react-router-dom";

function Owner_settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [notification, setNotification] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pobierz ownerId z sessionStorage
    const ownerId = sessionStorage.getItem("ownerId");

    if (!ownerId) {
      setNotification("Nie znaleziono ID właściciela. Spróbuj ponownie.");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setNotification("Nowe hasło i jego potwierdzenie muszą być takie same.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-owner-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setNotification("Hasło zostało zmienione pomyślnie");

        // Przeładuj stronę po krótkim czasie
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setNotification(result.error || "Błąd podczas zmiany hasła");
      }
    } catch (error) {
      console.error("Błąd podczas zmiany hasła:", error);
      setNotification("Wystąpił problem z serwerem");
    }
  };

  // Usuwanie powiadomienia po 3 sekundach
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <section className="owner_settings">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <Link to="/owner/profile">Wróć do profilu</Link>
      </span>
      <h1>Ustawienia konta</h1>
      <hr />
      <div className="container">
        <section className="password_section">
          <h2>Zmień hasło</h2>
          {notification && <p className="notification">{notification}</p>}
          <form className="password_form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="current_password">Bieżące hasło</label>
              <input
                type="password"
                id="current_password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Bieżące hasło"
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_password">Nowe hasło</label>
              <input
                type="password"
                id="new_password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nowe hasło"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_new_password">Potwierdź nowe hasło</label>
              <input
                type="password"
                id="confirm_new_password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Potwierdź nowe hasło"
              />
            </div>
            <button type="submit" className="change_password_btn">
              Zmień hasło
            </button>
          </form>
        </section>
        <section className="delete_account">
          <h2>Usuń konto</h2>
          <p>
            Usunięcie konta jest nieodwracalne. Wszystkie dane zostaną trwale
            usunięte.
          </p>
          <button className="delete_account_btn">Usuń konto</button>
        </section>
      </div>
    </section>
  );
}

export default Owner_settings;
