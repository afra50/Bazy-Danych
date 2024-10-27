import React from "react";
import "../styles/Footer.scss";
import logo from "../assets/images/logo.png";

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
        <a href="/SignIn">Zaloguj się</a>
        <a href="/SignUp">Załóż konto</a>
        <a href="">Moje rezerwacje</a>
      </div>
      <div className="column_footer">
        <h2>Konto właściciela</h2>
        <a href="/SignInAsOwner">Zaloguj się</a>
        <a href="">Moje oferty</a>
        <a href="">Rezerwacje</a>
      </div>
    </footer>
  );
}

export default Footer;
