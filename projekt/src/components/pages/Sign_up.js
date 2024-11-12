import React, { useState, useEffect } from "react";
import "../../styles/pages/Sign.scss";

function SignUp() {
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    telefon: "",
    email: "",
    haslo: "",
    potwierdzhaslo: "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(""); // Notification state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "", // Clear error for this field
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.imie) {
      newErrors.imie = "Imię jest obowiązkowe";
    }

    if (!formData.nazwisko) {
      newErrors.nazwisko = "Nazwisko jest obowiązkowe";
    }

    if (!formData.telefon) {
      newErrors.telefon = "Telefon jest wymagany";
    } else if (!/^\d+$/.test(formData.telefon)) {
      newErrors.telefon = "Numer telefonu musi składać się tylko z cyfr";
    }

    if (!formData.email) {
      newErrors.email = "E-mail jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail jest błędny";
    } else if (formData.email.split("@").length !== 2) {
      newErrors.email = "E-mail może zawierać tylko jeden znak @";
    }

    if (!formData.haslo) {
      newErrors.haslo = "Hasło jest wymagane";
    } else if (formData.haslo.length < 8) {
      newErrors.haslo = "Hasło musi mieć co najmniej 8 znaków";
    } else if (!/[A-Z]/.test(formData.haslo)) {
      newErrors.haslo = "Hasło musi zawierać co najmniej jedną wielką literę";
    }

    if (!formData.potwierdzhaslo) {
      newErrors.potwierdzhaslo = "Potwierdź hasło";
    } else if (formData.haslo !== formData.potwierdzhaslo) {
      newErrors.potwierdzhaslo = "Hasła nie są takie same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setNotification("Rejestracja zakończona sukcesem");
        } else if (response.status === 409) {
          setNotification("Konto z tym adresem e-mail już istnieje");
        } else {
          setNotification("Błąd podczas rejestracji");
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania danych:", error);
        setNotification("Wystąpił problem z rejestracją");
      }
    }
  };

  // Ukrycie powiadomienia po kilku sekundach
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer); // Sprzątanie timera
    }
  }, [notification]);

  return (
    <div className="sign_container">
      <div className="sign-form">
        <h2>Załóż konto</h2>
        {notification && (
          <div className="notification">{notification}</div> // Notification message
        )}
        <form onSubmit={handleSubmit}>
          {/* Imię */}
          <div className="form-group">
            <label>Imię</label>
            <input
              placeholder="Imię"
              type="text"
              id="imie"
              name="imie"
              value={formData.imie}
              onChange={handleChange}
              className={errors.imie ? "input-error" : ""}
            />
            <span className={errors.imie ? "error error-active" : "error"}>
              {errors.imie}
            </span>
          </div>

          {/* Nazwisko */}
          <div className="form-group">
            <label>Nazwisko</label>
            <input
              placeholder="Nazwisko"
              type="text"
              id="nazwisko"
              name="nazwisko"
              value={formData.nazwisko}
              onChange={handleChange}
              className={errors.nazwisko ? "input-error" : ""}
            />
            <span className={errors.nazwisko ? "error error-active" : "error"}>
              {errors.nazwisko}
            </span>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Adres e-mail</label>
            <input
              placeholder="Adres e-mail"
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            <span className={errors.email ? "error error-active" : "error"}>
              {errors.email}
            </span>
          </div>

          {/* Telefon */}
          <div className="form-group">
            <label>Numer telefonu</label>
            <input
              placeholder="Numer telefonu"
              type="text"
              id="telefon"
              name="telefon"
              maxLength="9"
              value={formData.telefon}
              onChange={handleChange}
              className={errors.telefon ? "input-error" : ""}
            />
            <span className={errors.telefon ? "error error-active" : "error"}>
              {errors.telefon}
            </span>
          </div>

          {/* Hasło */}
          <div className="form-group">
            <label>Hasło</label>
            <input
              placeholder="Hasło"
              type="password"
              id="haslo"
              name="haslo"
              value={formData.haslo}
              onChange={handleChange}
              className={errors.haslo ? "input-error" : ""}
            />
            <span className={errors.haslo ? "error error-active" : "error"}>
              {errors.haslo}
            </span>
          </div>

          {/* Potwierdzenie hasła */}
          <div className="form-group">
            <label>Potwierdź hasło</label>
            <input
              placeholder="Potwierdź hasło"
              type="password"
              id="potwierdzhaslo"
              name="potwierdzhaslo"
              value={formData.potwierdzhaslo}
              onChange={handleChange}
              className={errors.potwierdzhaslo ? "input-error" : ""}
            />
            <span
              className={errors.potwierdzhaslo ? "error error-active" : "error"}
            >
              {errors.potwierdzhaslo}
            </span>
          </div>

          <div className="to_sign">
            <span>Masz już konto?</span>
            <a href="/SignIn">Zaloguj się</a>
          </div>
          <button type="submit" className="btn-submit">
            Zarejestruj
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
