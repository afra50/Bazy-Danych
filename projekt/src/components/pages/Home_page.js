import React from "react";
import "../../styles/pages/Home_page.scss";
import Search from "../Search";
import Home_description from "../Home_description";
import Recommended from "../Recommended";

function Home_page() {
  return (
    <main>
      <Search></Search>
      <Home_description />
      <Recommended />
    </main>
  );
}

export default Home_page;
