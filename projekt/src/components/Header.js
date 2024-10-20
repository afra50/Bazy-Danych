import React from "react";
import logo from "../assets/images/logo.png";
import "../styles/Header.scss";

function Header() {
  return (
    <header class="top_bar">
      <a href="/" id="logo">
        <img src={logo} alt="logo" id="logo_picture"></img>
      </a>
      <nav class="navi">
        <a href="/SignIn">Zaloguj się</a>
        <a href="/SignUp">Zarejestruj się</a>
      </nav>
    </header>
  );
}

export default Header;
