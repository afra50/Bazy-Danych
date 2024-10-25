import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth_context";
import "../../styles/pages/Sign.scss";

function SignInAsOwner() {
  const [formData, setFormData] = useState({
    email: "",
    haslo: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Użycie funkcji logowania z kontekstu

  // Przechwycenie docelowej ścieżki (jeśli istnieje)
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/login-owner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json(); // Otrzymujemy dane właściciela w formacie JSON
          sessionStorage.setItem("role", "owner");
          sessionStorage.setItem("ownerId", data.id_wlasciciela); // Zapisujemy ID właściciela
          login("owner");
          navigate(from, { replace: true });
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Błąd podczas logowania");
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania danych:", error);
        alert("Wystąpił problem z logowaniem");
      }
    }
  };

  return (
    <div className="sign_container">
      <div className="sign-form">
        <h2>Zaloguj się jako gospodarz</h2>
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
            <a href="/SignUp">Zarejestruj się</a>
          </div>
          <button type="submit" className="btn-submit">
            Zaloguj się
          </button>
        </form>
        <p>Lub</p>
        <a href="/SignIn" className="toSignAsOther">
          Zaloguj się jako klient
        </a>
      </div>
    </div>
  );
}

export default SignInAsOwner;
