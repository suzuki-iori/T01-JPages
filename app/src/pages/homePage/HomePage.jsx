import React from "react";
import Header from "../../components/header/Header";
import HomeField from "./components/homeField/HomeField";
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