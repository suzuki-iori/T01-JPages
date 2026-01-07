// import React, { useState } from 'react';
import styles from './HamburgerMenu.module.scss';

function HamburgerMenu() {
  console.log("もし思い出したらここにきて components/hanburgerMenu");
  
  return (
    <>
      <div className={styles.msNavContainer}>
        <ul className={styles.msNav}>
          <input type="checkbox" id="msMenu" className={`${styles.msMenu} ${styles.msMenuToggle}`} name="msMenu-toggle" />
          <li className={`${styles.msLi} ${styles.msLi2}`}>
            <a href="#">
              <span className={`${styles.fa} ${styles.faFlask}`}></span>
            </a>
          </li>
          <li className={`${styles.msLi} ${styles.msLi1}`}>
            <a href="#">
              <span className={`${styles.fa} ${styles.faFortAwesome}`}></span>
            </a>
          </li>
          <li className={styles.msMain}>
            <a href="#">
              <label className={styles.msMenuToggleLbl} for="msMenu">
                <span className={`${styles.fa} ${styles.faPlus}`}></span>
              </label>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default HamburgerMenu;
