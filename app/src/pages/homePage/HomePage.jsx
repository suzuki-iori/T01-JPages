import React from "react";
import Header from "../../components-old/organisms/header/Header";
import HomeField from "../../components-old/organisms/homeField/HomeField";
import RandomHamburger from "../../components-old/organisms/randomHamburger/RandomHamburger";
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