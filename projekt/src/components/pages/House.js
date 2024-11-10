import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/pages/House.scss";

function House() {
  const { id_domku } = useParams();
  const [domek, setDomek] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/houses/${id_domku}`)
      .then((response) => response.json())
      .then((data) => setDomek(data))
      .catch((error) =>
        console.error("Błąd przy pobieraniu danych domku:", error)
      );
  }, [id_domku]);

  if (!domek) {
    return <p>Ładowanie...</p>;
  }

  return (
    <section className="house-details">
      <h1>{domek.nazwa}</h1>
      <p>Lokalizacja: {domek.lokalizacja}</p>
      <p>Kategoria: {domek.kategoria}</p>
      <img
        src={`http://localhost:5000/domki/${domek.id_domku}/${domek.id_domku}_1.jpg`}
        alt={domek.nazwa}
      />
      <div className="details">
        <p>Opis: {domek.opis}</p>
        <p>Cena za noc: {domek.cena}</p>
      </div>
    </section>
  );
}

export default House;
