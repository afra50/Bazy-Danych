import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Recommended.scss";

function Recommended() {
  const [domki, setDomki] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/recommended`)
      .then((response) => response.json())
      .then((data) => setDomki(data))
      .catch((error) => console.error("Błąd przy pobieraniu danych:", error));
  }, []);

  return (
    <section className="recommended">
      <h1>Polecane domki</h1>
      <hr />
      <div className="wrapper">
        {domki.map((domek) => (
          <Link
            to={`/houses/${domek.id_domku}`}
            key={domek.id_domku}
            className="card-link"
          >
            <div className="card">
              <div className="image-wrapper">
                <img
                  src={`http://localhost:5000/domki/${domek.id_domku}/${domek.id_domku}_1.jpg`}
                  alt={domek.nazwa}
                />
                <span className="category">{domek.kategoria}</span>
              </div>
              <h2>{domek.nazwa}</h2>
              <p>{domek.lokalizacja}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/searchpage" className="more-places-link">
        Zobacz więcej miejsc
      </Link>
    </section>
  );
}

export default Recommended;
