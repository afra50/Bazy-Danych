import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import "../styles/Header.scss";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    setIsMenuOpen(false);
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <header className="top_bar">
      <a href="/" id="logo">
        <img src={logo} alt="logo" id="logo_picture"></img>
      </a>
      <nav className="navi">
        {isLoggedIn ? (
          <div className={`user-menu ${isMenuOpen ? "open" : ""}`}>
            <div className="user-icon" onClick={toggleMenu}>
              <i class="fa-solid fa-bars" id="burger-menu"></i>
              <i class="fa-solid fa-user"></i>
            </div>
            <ul className="dropdown-menu">
              {role === "owner" ? (
                <>
                  <li>
                    <a href="/owner/profile">Profil</a>
                  </li>
                  <li>
                    <a href="/owner/offers">Moje oferty</a>
                  </li>
                  <li>
                    <a href="/owner/reservations">Rezerwacje</a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/client/reservations">Moje rezerwacje</a>
                  </li>
                </>
              )}
              <li>
                <a href="/" onClick={handleLogout}>
                  Wyloguj się
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <a href="/SignIn">Zaloguj się</a>
            <a href="/SignUp">Zarejestruj się</a>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
