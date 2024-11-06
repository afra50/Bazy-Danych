import React from "react";
import "../styles/Home_description.scss";

function Home_description() {
  return (
    <section className="home_description">
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
        <a href="/searchpage">Poznaj miejsca pełne magii</a>
      </div>
    </section>
  );
}

export default Home_description;
