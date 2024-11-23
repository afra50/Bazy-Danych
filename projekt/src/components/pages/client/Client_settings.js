// src/components/Client_settings.js
import React, { useState, useEffect } from "react";
import "../../../styles/pages/client/Client_settings.scss"; // Utwórz osobny plik SCSS dla klienta
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth_context";

function Client_settings() {
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    telefon: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const { logout } = useAuth();

  // Handle changes for updating data
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes for changing password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Handle changes for delete password
  const handleDeletePasswordChange = (e) => {
    setDeletePassword(e.target.value);
  };

  // Handle updating client data
  const handleUpdateData = async (e) => {
    e.preventDefault();

    const clientId = sessionStorage.getItem("clientId");

    if (!clientId) {
      setNotification("Nie znaleziono ID klienta. Spróbuj ponownie.");
      return;
    }

    // Walidacja danych
    if (
      !formData.imie ||
      !formData.nazwisko ||
      !formData.email ||
      !formData.telefon
    ) {
      setNotification("Wszystkie pola są wymagane.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}/update-data`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setNotification("Dane zostały pomyślnie zaktualizowane.");
        // Opcjonalnie, można odświeżyć dane lub przekierować
      } else {
        setNotification(result.error || "Błąd podczas aktualizacji danych.");
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji danych:", error);
      setNotification("Wystąpił problem z serwerem.");
    }
  };

  // Handle changing password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setNotification("Nowe hasło i jego potwierdzenie muszą być takie same.");
      return;
    }

    const clientId = sessionStorage.getItem("clientId");

    if (!clientId) {
      setNotification("Nie znaleziono ID klienta. Spróbuj ponownie.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/clients/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setNotification("Hasło zostało pomyślnie zmienione.");
        // Opcjonalnie, można wyczyścić pola formularza
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setNotification(result.error || "Błąd podczas zmiany hasła.");
      }
    } catch (error) {
      console.error("Błąd podczas zmiany hasła:", error);
      setNotification("Wystąpił problem z serwerem.");
    }
  };

  // Handle deleting account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    // Potwierdzenie przed usunięciem
    const isConfirmed = window.confirm(
      "Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć."
    );

    if (!isConfirmed) {
      return;
    }

    const clientId = sessionStorage.getItem("clientId");

    if (!clientId) {
      setNotification("Nie znaleziono ID klienta. Spróbuj ponownie.");
      return;
    }

    if (!deletePassword) {
      setNotification("Podanie hasła jest wymagane do usunięcia konta.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/clients/delete-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId,
            password: deletePassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setNotification("Konto zostało pomyślnie usunięte.");

        // Wylogowanie
        logout();

        // Usunięcie clientId z sessionStorage
        sessionStorage.removeItem("clientId");

        // Przekierowanie na stronę logowania po krótkim czasie
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        setNotification(result.error || "Błąd podczas usuwania konta.");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania konta:", error);
      setNotification("Wystąpił problem z serwerem.");
    }
  };

  // Usuwanie powiadomienia po 3 sekundach
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Pobranie danych klienta przy montowaniu komponentu
  useEffect(() => {
    const fetchClientData = async () => {
      const clientId = sessionStorage.getItem("clientId");
      if (!clientId) {
        setNotification("Nie znaleziono ID klienta. Spróbuj ponownie.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/clients/${clientId}`
        );
        const result = await response.json();

        if (response.ok) {
          setFormData({
            imie: result.imie || "",
            nazwisko: result.nazwisko || "",
            email: result.email || "",
            telefon: result.telefon || "",
          });
        } else {
          setNotification(
            result.error || "Błąd podczas pobierania danych klienta."
          );
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych klienta:", error);
        setNotification("Wystąpił problem z serwerem.");
      }
    };

    fetchClientData();
  }, []);

  return (
    <section className="client_settings">
      <h1>Ustawienia konta</h1>
      <hr />
      {notification && <p className="notification">{notification}</p>}
      <div className="container">
        <section className="update_data_section">
          <h2>Zmień dane</h2>
          <form className="update_data_form" onSubmit={handleUpdateData}>
            <div className="form-group">
              <label htmlFor="imie">Imię</label>
              <input
                type="text"
                id="imie"
                name="imie"
                value={formData.imie}
                onChange={handleDataChange}
                placeholder="Wprowadź imię"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nazwisko">Nazwisko</label>
              <input
                type="text"
                id="nazwisko"
                name="nazwisko"
                value={formData.nazwisko}
                onChange={handleDataChange}
                placeholder="Wprowadź nazwisko"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adres e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleDataChange}
                placeholder="Wprowadź e-mail"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefon">Telefon</label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleDataChange}
                placeholder="Wprowadź numer telefonu"
                required
              />
            </div>
            <button type="submit" className="update_data_btn">
              Zaktualizuj dane
            </button>
          </form>
        </section>
        <section className="change_password_section">
          <h2>Zmień hasło</h2>
          <form
            className="change_password_form"
            onSubmit={handleChangePassword}
          >
            <div className="form-group">
              <label htmlFor="currentPassword">Bieżące hasło</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Bieżące hasło"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nowe hasło</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nowe hasło"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Potwierdź nowe hasło</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Potwierdź nowe hasło"
                required
              />
            </div>
            <button type="submit" className="change_password_btn">
              Zmień hasło
            </button>
          </form>
        </section>
        <section className="delete_account_section">
          <h2>Usuń konto</h2>
          <p>
            Usunięcie konta jest nieodwracalne. Wszystkie dane zostaną trwale
            usunięte.
          </p>
          <form className="delete_account_form" onSubmit={handleDeleteAccount}>
            <div className="form-group">
              <label htmlFor="deletePassword">Potwierdź hasło</label>
              <input
                type="password"
                id="deletePassword"
                name="deletePassword"
                value={deletePassword}
                onChange={handleDeletePasswordChange}
                placeholder="Wprowadź swoje hasło"
                required
              />
            </div>
            <button className="delete_account_btn">Usuń konto</button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default Client_settings;
