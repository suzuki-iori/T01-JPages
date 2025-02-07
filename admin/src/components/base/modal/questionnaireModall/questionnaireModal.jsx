import React from 'react'
import Ajax from '../../../../hooks/Ajax';
import { useAuth } from '../../../../context/AuthContext';
import { useState } from 'react';
import styles from './questionnaireModal.module.css';
import { useNavigate } from "react-router-dom";


const questionnaireModal = (props) => {
  const token = useAuth();
  const [title, setTitle] = useState();
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const inputTitle = (e) => {
    setTitle(e.target.value);
    setInputValue(e.target.value);
    console.log(e.target.value);
  };

  const closeModal = () => {
  props.setShowModal(false);
  };  
  const handleAddQue = (ev) => {
    ev.preventDefault();

    const req = {
      title : title
    }
    Ajax(null, token.token, `questionnaire`, 'post', req)
    .then((data) => {
        if(data.status === "success") {
            console.log("dekite");
            closeModal();
            navigate('/admin/question');
        } else {
            console.log(data.status);
        }
        setShowModal(true);
    });
}
  return (
    <>
    {props.showFlag ? (
        <div id={styles.overlay} style={overlay}>
            <div id={styles.modalContent} style={modalContent}>
              <div className={styles.addModalTitleArea}>
                <h2>新しいアンケートを作成します</h2>
                <button  className={styles.cancelButton} onClick={closeModal}><span>×</span></button>
              </div>
              <form action="">
                <dl className={styles.addInnerForm}>
                    <div className={styles.addQueTitleForm}>
                      <dt><label htmlFor="text">タイトル</label></dt>
                      <dd>
                        <input type="text" id="QueTitle" maxLength={30} onChange={inputTitle} value={inputValue}  required >
                        </input>
                      </dd>
                    </div>
                    <button type="submit" className={!inputValue ? styles.disabled : styles.submitButton}   onClick={handleAddQue}  disabled={!inputValue}>OK</button>
                </dl>
              </form>
            </div>
        </div>
    ) : null}

    </>
    );
}
const modalContent = {
  background: "white",
  width:"500px",
  height:"200px",
  padding: "10px",
  borderRadius: "10px",

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
};


export default questionnaireModal