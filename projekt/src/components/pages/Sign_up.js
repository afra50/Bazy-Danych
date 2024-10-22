import React, { useState } from "react";
import "../../styles/pages/Sign_up.scss";

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

  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Walidacja formularza
  const validateForm = () => {
    const newErrors = {};

    if (!formData.imiw) {
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
    }

    if (!formData.haslo) {
      newErrors.haslo = "Hasło jest wymagane";
    }

    if (!formData.potwierdzhaslo) {
      newErrors.potwierdzhaslo = "Potwierdź hasło";
    } else if (formData.haslo !== formData.potwierdzhaslo) {
      newErrors.potwierdzhaslo = "Hasła nie są takie same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obsługa wysyłania formularza
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form data:", formData);
      // Wyślij dane na serwer lub obsłuż je lokalnie
    }
  };

  return (
    <div className="sign-form">
      <h2>Załóż konto</h2>
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
            required
          />
          {errors.imie && <span className="error">{errors.imie}</span>}
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
            required
          />
          {errors.nazwisko && <span className="error">{errors.nazwisko}</span>}
        </div>

        {/* Telefon */}
        <div className="form-group">
          <label>Numer telefonu</label>
          <input
            placeholder="Numer telefonu"
            type="text"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            required
          />
          {errors.telefon && <span className="error">{errors.telefon}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Adres e-mail</label>
          <input
            placeholder="Adres e-mail"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
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
            required
          />
          {errors.haslo && <span className="error">{errors.haslo}</span>}
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
            required
          />
          {errors.potwierdzhaslo && (
            <span className="error">{errors.potwierdzhaslo}</span>
          )}
        </div>

        <button type="submit" className="btn-submit">
          Zarejestruj
        </button>
      </form>
    </div>
  );
}

export default SignUp;
