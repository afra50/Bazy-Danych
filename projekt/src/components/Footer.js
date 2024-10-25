import React from "react";
import "../styles/Footer.scss";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="column_footer">
        <img src={logo} alt="logo" id="footer_logo"></img>
        <p>
          <span>wyjedzstad@mail.com</span>
          <span>+48 728 273 283</span>
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
