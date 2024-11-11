import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "../../styles/pages/House.scss";

function House() {
  const { id_domku } = useParams();
  const [domek, setDomek] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/houses/${id_domku}`)
      .then((response) => response.json())
      .then((data) => setDomek(data))
      .catch((error) =>
        console.error("Błąd przy pobieraniu danych domku:", error)
      );

    fetch(`http://localhost:5000/api/houses/${id_domku}/images`)
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) =>
        console.error("Błąd przy pobieraniu obrazów domku:", error)
      );
  }, [id_domku]);

  if (!domek) {
    return <p>Ładowanie...</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    swipe: true,
    touchMove: true,
  };

  return (
    <section className="house-details">
      <div className="image-slider">
        <span className="back">
          <i className="fa-solid fa-chevron-left"></i>
          <a href="/searchpage">Wróć do wyszukiwania</a>
        </span>
        {/* Statyczna nakładka z nazwą domku */}
        <div className="slider-title">
          <h1>{domek.nazwa}</h1>
        </div>

        {/* Karuzela ze zdjęciami */}
        <Slider {...settings}>
          {images.map((imageUrl, index) => (
            <div key={index} className="image-wrapper">
              <img
                src={imageUrl}
                alt={`${domek.nazwa} - zdjęcie ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="details">
        <div className="details-container">
          <div className="house_description">
            <h1>{domek.nazwa}</h1>
            <em>
              <p>{domek.lokalizacja},</p>
              <p>{domek.kategoria}</p>
            </em>
            <p>{domek.opis}</p>
          </div>
          <div className="to_reservation">
            <p className="price">Cena za noc: {domek.cena_za_noc} zł</p>
            {/* Placeholder na kalendarz */}
            <div className="calendar-placeholder">
              {/* Kalendarz zostanie dodany później */}
              <p>Kalendarz dostępności</p>
            </div>
            <button className="reserve-button">Zarezerwuj</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default House;
