// src/components/pages/SignIn.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Auth_context"; // Upewnij się, że ścieżka jest poprawna
import "../../styles/pages/Sign.scss";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    haslo: "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Walidacja formularza
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "E-mail jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail jest błędny";
    }

    if (!formData.haslo) {
      newErrors.haslo = "Hasło jest wymagane";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();

          login("client", data);

          navigate(from, { replace: true });
        } else if (response.status === 401) {
          setNotification("Błędne hasło lub e-mail");
        } else {
          const errorMessage = await response.text();
          setNotification(errorMessage || "Błąd podczas logowania");
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania danych:", error);
        setNotification("Wystąpił problem z logowaniem");
      }
    }
  };

  return (
    <div className="sign_container">
      <div className="sign-form">
        <h2>Zaloguj się jako klient</h2>

        {/* Renderowanie powiadomienia */}
        {notification && <div className="notification">{notification}</div>}

        <form onSubmit={handleSubmit}>
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

          <div className="to_sign">
            <span>Nie masz konta?</span>
            <Link to="/SignUp">Zarejestruj się</Link>
          </div>
          <button type="submit" className="btn-submit">
            Zaloguj się
          </button>
        </form>
        <p>Lub</p>
        <Link to="/SignInAsOwner" className="toSignAsOther">
          Zaloguj się jako gospodarz
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
