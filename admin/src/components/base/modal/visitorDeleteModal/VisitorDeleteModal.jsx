import React from "react";
import styles from './VisitorDeleteModal.module.css'
import Ajax from "../../../../hooks/Ajax";
import { useAuth } from "../../../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';


const VisitorDeleteModal = (props) => {
    const token = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const closeModal = () => {
        props.setShowDeleteModal(false);
    };
    const deleteVisitor = () => {
        Ajax(null, token.token, `visitor/${id}`, 'DELETE')
        .then((data) => {
            if(data && data.status === "success") {
                closeModal();
                swal.fire({
                    title: '削除完了',
                    text: '来場者情報の削除が完了しました。',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                navigate('/admin/visitor');
            } else {
                swal.fire({
                    title: 'エラー',
                    text: 'エラーが発生しました。もう一度お試しください',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(() => {
            swal.fire({
                title: 'エラー',
                text: '通信エラーが発生しました。',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    return (
    <>
            {props.showFlag ? (
        <div id={styles.overlay} style={overlay}>
            <div id={styles.modalContent} style={modalContent}>
                    <h2>この来場者の情報を削除します</h2>
                    <p>本当によろしいですか</p>
            <div className={styles.buttonWrapper}>
                <button className={styles.cancelButton} onClick={closeModal}>キャンセル</button>
                <button className={styles.corectButton} onClick={deleteVisitor} >削除</button>
            </div>
            </div>
        </div>
    ) : null}

    </>
    );
};
const modalContent = {
    background: "white",
    width:"500px",
    height:"150px",
    padding: "10px",
    borderRadius: "10px",
        zIndex: 1500,

  };

  const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
        zIndex: 1400,
  };


export default VisitorDeleteModal;
