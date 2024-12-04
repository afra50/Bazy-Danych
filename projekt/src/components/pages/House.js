// House.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/pages/House.scss";
import Owner_details from "../Owner_details";
import { format } from "date-fns";

function House() {
  const { id_domku } = useParams();
  const navigate = useNavigate();
  const [domek, setDomek] = useState(null);
  const [images, setImages] = useState([]);
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [notification, setNotification] = useState("");

  const today = new Date();
  const maxMonth = today.getMonth() + 5;
  const maxYear = today.getFullYear() + Math.floor(maxMonth / 12);
  const adjustedMaxMonth = maxMonth % 12;
  const maxDate = new Date(maxYear, adjustedMaxMonth + 1, 0);

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  // Funkcja do wyłączania niedostępnych dat w kalendarzu
  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
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

      const datesInRange = getDatesInRange(start, end);

      const hasUnavailable = datesInRange.some((date) =>
        isDateUnavailable(date)
      );

      if (hasUnavailable) {
        setNotification("Termin niedostępny - wybierz inny przedział.");
        setSelectedRange(null);
      } else {
        setSelectedRange(range);
      }
    } else {
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
            <span className="access">Sprawdź dostępność</span>
            {/* Kalendarz dostępności */}
            <div className="calendar">
              <Calendar
                onChange={handleDateChange}
                selectRange={true}
                tileDisabled={tileDisabled}
                minDate={today}
                maxDate={maxDate}
                view="month"
                minDetail="month"
                maxDetail="month"
                activeStartDate={activeStartDate}
                onActiveStartDateChange={onActiveStartDateChange}
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={false}
              />
            </div>
            <button
              className="reserve-button"
              onClick={() => {
                if (selectedRange && selectedRange.length === 2) {
                  const [start, end] = selectedRange;
                  console.log("Przekazywanie dat:", start, end);
                  navigate(
                    `/rezerwacja/${id_domku}?start=${format(
                      start,
                      "yyyy-MM-dd"
                    )}&end=${format(end, "yyyy-MM-dd")}`
                  );
                } else {
                  console.log("Brak wybranego przedziału dat");
                  navigate(`/rezerwacja/${id_domku}`);
                }
              }}
            >
              Zarezerwuj teraz
            </button>
          </div>
        </div>
      </div>
      <hr />
      <Owner_details houseId={id_domku} />
      <hr />
      {/* Renderowanie powiadomienia */}
      {notification && <div className="notification">{notification}</div>}
    </section>
  );
}

export default House;
