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
              <i className="fa-solid fa-bars" id="burger-menu"></i>
              <i className="fa-solid fa-user"></i>
            </div>
            <ul className="dropdown-menu">
              {role === "owner" ? (
                <>
                  <li>
                    <a href="/owner/profile">
                      <i className="fa-solid fa-user-pen"></i> Profil
                    </a>
                  </li>
                  <li>
                    <a href="/owner/offers">
                      <i className="fa-solid fa-house"></i> Moje oferty
                    </a>
                  </li>
                  <li>
                    <a href="/owner/reservations">
                      <i className="fa-solid fa-note-sticky"></i> Rezerwacje
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/client/reservations">
                      <i className="fa-solid fa-note-sticky"></i> Moje
                      rezerwacje
                    </a>
                  </li>
                </>
              )}
              <li>
                <a href="/" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Wyloguj się
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
