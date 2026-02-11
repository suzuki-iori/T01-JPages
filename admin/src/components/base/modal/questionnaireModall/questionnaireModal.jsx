import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Ajax from '../../../../hooks/Ajax';
import { useAuth } from '../../../../context/AuthContext';
import styles from './questionnaireModal.module.css';

const QuestionnaireModal = (props) => {
  const token = useAuth();
  const [title, setTitle] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  const navigate = useNavigate();

  const inputTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleCheck = (e) => {
    setIsActive(e.target.checked);
  };

  const closeModal = () => {
    props.setShowModal(false);
    setTitle('');
    setIsActive(false); 
  };

  const handleAddQue = (ev) => {
    ev.preventDefault();

    const req = {
      title: title,
      is_active: isActive 
    };

    Ajax(null, token.token, `questionnaire`, 'post', req)
      .then((data) => {
        if (data.status === "success") {
          closeModal();
          navigate('/admin/question');
        } else {
          console.error("作成に失敗しました");
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  if (!props.showFlag) return null;

  return (
    <div id={styles.overlay} style={overlayStyle}>
      <div id={styles.modalContent} style={modalContentStyle}>
        <div className={styles.addModalTitleArea}>
          <h2>新しいアンケートを作成します</h2>
          <button className={styles.cancelButton} onClick={closeModal} type="button">
            <span>×</span>
          </button>
        </div>
        <form onSubmit={handleAddQue}>
          <dl className={styles.addInnerForm}>
            <div className={styles.addQueTitleForm}>
              <dt><label htmlFor="QueTitle">タイトル</label></dt>
              <dd>
                <input
                  type="text"
                  id="QueTitle"
                  maxLength={30}
                  onChange={inputTitle}
                  value={title}
                  required
                />
              </dd>
            </div>

            <div style={{ marginTop: '10px', textAlign: 'left', paddingLeft: '5px' }}>
              <label htmlFor="isActiveCheck" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={handleCheck}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                作成と同時に公開する
              </label>
            </div>

            <button
              type="submit"
              className={!title ? styles.disabled : styles.submitButton}
              disabled={!title}
            >
              OK
            </button>
          </dl>
        </form>
      </div>
    </div>
  );
};

const modalContentStyle = {
  background: "white",
  width: "500px",
  height: "250px", 
  padding: "10px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

export default QuestionnaireModal;