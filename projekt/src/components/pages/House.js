// House.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/pages/House.scss";

function House() {
  const { id_domku } = useParams();
  const navigate = useNavigate();
  const [domek, setDomek] = useState(null);
  const [images, setImages] = useState([]);
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null); // Zmieniono na selectedRange
  const [loading, setLoading] = useState(true);
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // Obliczenie maksymalnej daty (ostatni dzień piątego pełnego miesiąca w przód)
  const today = new Date();
  const maxMonth = today.getMonth() + 5; // Miesiące są indeksowane od 0
  const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);
  const adjustedMaxMonth = maxMonth % 12;
  const maxDate = new Date(maxYear, adjustedMaxMonth + 1, 0); // Dzień 0 następnego miesiąca to ostatni dzień bieżącego miesiąca

  useEffect(() => {
    // Funkcja do pobierania danych domku
    const fetchHouseData = async () => {
      try {
        const [houseRes, imagesRes, availabilityRes] = await Promise.all([
          fetch(`http://localhost:5000/api/houses/${id_domku}`),
          fetch(`http://localhost:5000/api/houses/${id_domku}/images`),
          fetch(`http://localhost:5000/api/houses/${id_domku}/availability`),
        ]);

        if (!houseRes.ok) throw new Error("Błąd przy pobieraniu domku");
        if (!imagesRes.ok) throw new Error("Błąd przy pobieraniu obrazów");
        if (!availabilityRes.ok)
          throw new Error("Błąd przy pobieraniu dostępności");

        const houseData = await houseRes.json();
        const imagesData = await imagesRes.json();
        const availabilityData = await availabilityRes.json();

        setDomek(houseData);
        setImages(imagesData);
        setUnavailableRanges(availabilityData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchHouseData();
  }, [id_domku]);

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (!domek) {
    return <p>Nie znaleziono domku.</p>;
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

  // Funkcja sprawdzająca, czy data jest niedostępna
  const isDateUnavailable = (date) => {
    return unavailableRanges.some((range) => {
      const start = new Date(range.data_od);
      const end = new Date(range.data_do);
      // Ustaw czas na początku dnia dla dokładniejszego porównania
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  // Funkcja do wyłączania niedostępnych dat w kalendarzu
  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    // Wyłącz daty przed minDate i po maxDate oraz niedostępne daty
    const minDate = new Date();
    return date < minDate || date > maxDate || isDateUnavailable(date);
  };

  // Funkcja obsługująca zmianę aktywnego startowego miesiąca
  const onActiveStartDateChange = ({ activeStartDate }) => {
    if (activeStartDate > maxDate) {
      setActiveStartDate(maxDate);
    } else {
      setActiveStartDate(activeStartDate);
    }
  };

  // Funkcja do generowania wszystkich dat w przedziale
  const getDatesInRange = (start, end) => {
    const date = new Date(start);
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  // Funkcja obsługująca zmianę zakresu dat
  const handleDateChange = (range) => {
    if (!range) {
      setSelectedRange(null);
      return;
    }

    if (range.length === 2) {
      const [start, end] = range;

      // Uzyskaj wszystkie daty w wybranym przedziale
      const datesInRange = getDatesInRange(start, end);

      // Sprawdź, czy którakolwiek data w przedziale jest niedostępna
      const hasUnavailable = datesInRange.some((date) =>
        isDateUnavailable(date)
      );

      if (hasUnavailable) {
        alert(
          "Wybrany przedział zawiera niedostępne daty. Proszę wybrać inny przedział."
        );
        setSelectedRange(null);
      } else {
        setSelectedRange(range);
        // Przekierowanie do formularza rezerwacji z przekazaniem obu dat
        navigate(
          `/rezerwacja/${id_domku}?start=${start.toISOString()}&end=${end.toISOString()}`
        );
      }
    } else {
      // Częściowy wybór (tylko start date)
      setSelectedRange(range);
    }
  };

  return (
    <section className="house-details">
      <div className="image-slider">
        <span className="back">
          <i className="fa-solid fa-chevron-left"></i>
          <Link to="/searchpage">Wróć do wyszukiwania</Link>
        </span>
        {/* Nakładka z nazwą domku */}
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
            <h1>
              {domek.nazwa}
              <span className="guests">
                {domek.liczba_osob}
                <i className="fa-solid fa-user-group"></i>
              </span>
            </h1>
            <em>
              <p>{domek.lokalizacja},</p>
              <p>{domek.kategoria}</p>
            </em>
            <p>{domek.opis}</p>
          </div>
          <div className="to_reservation">
            <p className="price">
              <em>{domek.cena_za_noc} zł</em> /noc
            </p>
            {/* Kalendarz dostępności */}
            <div className="calendar">
              <Calendar
                onChange={handleDateChange}
                selectRange={true}
                tileDisabled={tileDisabled}
                minDate={today} // Wyłącza daty w przeszłości
                maxDate={maxDate} // Ustawia maksymalną dostępną datę
                view="month"
                minDetail="month"
                maxDetail="month"
                activeStartDate={activeStartDate}
                onActiveStartDateChange={onActiveStartDateChange}
                prev2Label={null} // Ukrywa przyciski przesuwania o rok wstecz
                next2Label={null} // Ukrywa przyciski przesuwania o rok w przód
                showNeighboringMonth={false}
              />
            </div>
            <button
              className="reserve-button"
              onClick={() => {
                if (selectedRange && selectedRange.length === 2) {
                  const [start, end] = selectedRange;
                  navigate(
                    `/rezerwacja/${id_domku}?start=${start.toISOString()}&end=${end.toISOString()}`
                  );
                } else {
                  alert("Proszę wybrać przedział dat rezerwacji.");
                }
              }}
            >
              Zarezerwuj teraz
            </button>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="owner-details"></div>
    </section>
  );
}

export default House;
