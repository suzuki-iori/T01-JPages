import React from 'react'
import styles from './LogoutModal.module.css';
import Button from '@mui/material/Button'; 

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 style={{marginBottom:'10px'}}>ログアウトしますか？</h2>
                <Button variant="contained" color="primary" onClick={onLogout}>
                はい
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose} style={{ marginLeft: '8px' }}>
                いいえ
                </Button>
            </div>
        </div>
    );
};


export default LogoutModal
