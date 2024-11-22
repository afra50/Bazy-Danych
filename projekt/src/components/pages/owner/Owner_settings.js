import React, { useState, useEffect } from "react";
import "../../../styles/pages/owner/Owner_settings.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth_context";

function Owner_settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeletePasswordChange = (e) => {
    setDeletePassword(e.target.value);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      "Czy na pewno chcesz usunąć swoje konto?"
    );

    if (!isConfirmed) {
      return;
    }

    const ownerId = sessionStorage.getItem("ownerId");

    if (!ownerId) {
      setNotification("Nie znaleziono ID właściciela. Spróbuj ponownie.");
      return;
    }

    if (!deletePassword) {
      setNotification("Podanie hasła jest wymagane do usunięcia konta.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/owner/delete-owner-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId,
            password: deletePassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setNotification("Konto zostało pomyślnie usunięte.");

        logout();

        sessionStorage.removeItem("ownerId");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } else {
        setNotification(result.error || "Błąd podczas usuwania konta.");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania konta:", error);
      setNotification("Wystąpił problem z serwerem.");
    }
  };

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
          <form className="password_form">
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
          <form className="delete_form" onSubmit={handleDeleteAccount}>
            <div className="form-group">
              <label htmlFor="delete_password">Potwierdź hasło</label>
              <input
                type="password"
                id="delete_password"
                name="deletePassword"
                value={deletePassword}
                onChange={handleDeletePasswordChange}
                placeholder="Wprowadź swoje hasło"
              />
            </div>
            <button className="delete_account_btn">Usuń konto</button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default Owner_settings;
