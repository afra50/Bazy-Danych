import React from "react";
import "../../../styles/pages/owner/Owner_settings.scss";
import { Link } from "react-router-dom";

function Owner_settings() {
  return (
    <section className="owner_settings">
      <span className="back">
        <i className="fa-solid fa-chevron-left"></i>
        <Link to="/owner/profile">Wróć do profilu</Link>
      </span>
      <h1>Ustawienia konta</h1>
      <hr></hr>
      <div className="container">
        {/* Sekcja zmiany hasła */}
        <section className="password_section">
          <h2>Zmień hasło</h2>
          <form className="password_form">
            <div className="form-group">
              <label htmlFor="current_password">Bieżące hasło</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                placeholder="Wprowadź bieżące hasło"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Potwierdź bieżące hasło</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Potwierdź bieżące hasło"
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_password">Nowe hasło</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                placeholder="Wprowadź nowe hasło"
              />
            </div>
            <button type="submit" className="change_password_btn">
              Zmień hasło
            </button>
          </form>
        </section>

        {/* Sekcja usuwania konta */}
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
