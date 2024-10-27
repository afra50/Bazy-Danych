import React from "react";
import "../styles/Footer.scss";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="column_footer">
      <a href="/">
          <img src={logo} alt="logo" id="footer_logo" />
        </a>
        <p>
          <span>
          <a href="mailto:wyjedzstad@mail.com">wyjedzstad@mail.com</a>
          </span>
          <span>
          <a href="tel:+48728273283">+48 728 273 283</a>
          </span>
          <span>pn-pt 8:00-22:00</span>
          <span>sb-nd 9:00-20:00</span>
        </p>
      </div>
      <div className="column_footer">
      <h2>Konto klienta</h2>
        <Link to="/SignIn">Zaloguj się</Link>
        <Link to="/SignUp">Załóż konto</Link>
        <Link to="/client/reservations">Moje rezerwacje</Link>
      </div>
      <div className="column_footer">
        <h2>Konto właściciela</h2>
        <Link to="/SignInAsOwner">Zaloguj się</Link>
        <Link to="/owner/offers">Moje oferty</Link> 
        <Link to="/owner/reservations">Rezerwacje</Link> 
      </div>
    </footer>
  );
}

export default Footer;
