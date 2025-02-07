// Header.js
import React, { useState } from 'react';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUserCircle } from "react-icons/fa";

import { useAuth } from '../../../context/AuthContext'; // AuthContextのインポート
import LogoutModal from '../../base/modal/logout/LogoutModal';

export default function Header({ toggleSidebar, path }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { logout } = useAuth(); // useAuthフックを使用してlogout関数を取得

  const handleLoginAreaClick = () => {
    setModalOpen(true);
  };

  const handleLogout = () => {
    logout(); // AuthContextのlogout関数を呼び出す
    setModalOpen(false);
  };

  return (
    <>
      <header className={styles.Header}>
        <div className={styles.logosArea}>
          <FontAwesomeIcon icon="fa-solid fa-bars" size='lg' className={styles.ham} onClick={toggleSidebar} />
          <h1 className={styles.kadwabold}>JPages</h1>
        </div>
        <div className={styles.loginArea} onClick={handleLoginAreaClick}>
          <FaUserCircle size="3em" />
        </div>
      </header>
      <LogoutModal
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onLogout={handleLogout} 
      />
    </>
  );
}
