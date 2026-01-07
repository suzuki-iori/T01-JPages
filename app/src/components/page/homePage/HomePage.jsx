import React from "react";
import Header from "../../organisms/header/Header";
import HomeField from "../../organisms/homeField/HomeField";
import RandomHamburger from "../../organisms/randomHamburger/RandomHamburger";
function HomePage() {
  return (
    <>
      <Header/>
      <section id="home">
        <HomeField/>
        
      </section>
      <RandomHamburger/>
    </>
  );
}

export default HomePage