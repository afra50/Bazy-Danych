import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home_description.scss";

function Home_description() {
  const sectionRef = useRef(null); // Używamy ref, aby móc odnosić się do sekcji

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1, // Animacja uruchomi się, gdy 10% komponentu pojawi się w widoku
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Dodajemy klasę do sekcji
          const h1 = entry.target.querySelector("h1");
          const div = entry.target.querySelector("div");
          if (h1) h1.classList.add("animate"); // Dodajemy klasę animacji do h1
          if (div) div.classList.add("animate"); // Dodajemy klasę animacji do div
          observer.unobserve(entry.target); // Przestajemy obserwować komponent po animacji
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current); // Obserwujemy element referencji
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="home_description" ref={sectionRef}>
      <h1>
        Chwile, które <em>zapadają w pamięć</em>
      </h1>
      <div>
        <p>
          Odnajdź swoje miejsce, gdzie czas zwalnia, a codzienne troski
          przestają istnieć. Wśród szeptu drzew, śpiewu ptaków i szumu wiatru,
          odkryj przestrzeń, która pozwala na głębokie wytchnienie. Zanurz się w
          otoczeniu zieleni, poczuj bliskość przyrody na własnej skórze i
          delektuj się chwilą odpoczynku w swoim tempie. Ognisko pod
          gwiaździstym niebem, poranne mgły unoszące się nad jeziorem i cisza,
          która otula Cię niczym najcieplejszy koc – to doświadczenia, które
          budują wspomnienia.
        </p>
        <Link
          to={{
            pathname: "/searchpage",
            state: {
              searchParams: {
                dateRange: [null, null],
                location: "",
                guests: 1,
                categories: [],
              },
            },
          }}
        >
          Poznaj miejsca pełne magii
        </Link>
      </div>
    </section>
  );
}

export default Home_description;
