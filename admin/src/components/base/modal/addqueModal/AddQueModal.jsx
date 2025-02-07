import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import styles from './AddQueModal.module.css';
import Ajax from '../../../../hooks/Ajax';
import swal from 'sweetalert2';


const AddQueModal = (props) => {
  const token = useAuth();
  const queId = useParams(); // 質問登録用アンケートID
  const maxOrder = props.items.reduce((max, item) => Math.max(max, item.order) + 1, 0); // 質問登録用orderの最大値
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState("1"); // 初期値を文字列に変更

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const inputTitle = (e) => {
    setInputValue(e.target.value);
  };

  const closeModal = () => {
    props.setShowModal(false);
  };  

  const handleAddQue = (event) => {
    event.preventDefault();
    const req = {
      questionnaire_id: Number(queId.id),
      order: Number(maxOrder),
      question: inputValue,
      isstring: selectedValue === "1"
    };
    Ajax(null, token.token, `survey`, 'post', req)
      .then((data) => {
        if (data.status === "success") {
          swal.fire({
            title: '追加完了',
            text: 'アンケートの追加が完了しました',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          closeModal();
          
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error("エラーが発生しました:", error);
        swal.fire({
          title: 'エラー',
          text: 'エラーが発生しました。もう一度お試しください',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        
      });
  };

  return (
    <>
      {props.showFlag ? (
        <div id={styles.overlay} style={overlay}>
          <div id={styles.modalContent} style={modalContent}>
            <div className={styles.addModalTitleArea}>
              <h2>新しい質問を作成します</h2>
              <button className={styles.cancelButton} onClick={closeModal}>
                <span>×</span>
              </button>
            </div>
            <form onSubmit={handleAddQue}>
              <dl className={styles.addInnerForm}>
                <div className={styles.addQueTitleForm}>
                  <dt><label htmlFor="QueTitle">質問内容</label></dt>
                  <dd>
                    <input 
                      type="text" 
                      id="QueTitle" 
                      maxLength={30} 
                      onChange={inputTitle} 
                      value={inputValue} 
                      required 
                    />
                  </dd>
                </div>
                <div className={styles.selectArea}>
                  <dt><label htmlFor="select">回答形式</label></dt>
                  <dd>
                    <select value={selectedValue} onChange={handleChange} className={styles.checkText}>
                      <option value="1">text形式</option>
                      <option value="2">その他の形式</option>
                    </select>
                  </dd>
                </div>
                <button 
                  type="submit" 
                  className={!inputValue ? styles.disabled : styles.submitButton} 
                  disabled={!inputValue}
                >
                  OK
                </button>
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
  width: "500px",
  height: "280px",
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
  zIndex:999
};

export default AddQueModal;
