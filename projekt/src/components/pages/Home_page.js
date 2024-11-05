import React from "react";
import "../../styles/pages/Home_page.scss";
import Search from "../Search";
import Home_description from "../Home_description";

function Home_page() {
  return (
    <main>
      <Search></Search>
      <Home_description />
    </main>
  );
}

export default Home_page;
