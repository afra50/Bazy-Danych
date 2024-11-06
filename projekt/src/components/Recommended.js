import React, { useState, useEffect } from "react";
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
      <div className="wrapper">
        {domki.map((domek) => (
          <div className="card" key={domek.id}>
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
        ))}
      </div>
      <a href="/">Zobacz więcej miejsc</a>
    </section>
  );
}

export default Recommended;
