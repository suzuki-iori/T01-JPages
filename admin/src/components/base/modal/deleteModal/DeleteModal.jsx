import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useParams } from 'react-router-dom';
import styles from './DeleteModal.module.css';
import Ajax from '../../../../hooks/Ajax';
import swal from 'sweetalert2';

const DeleteModal = ({ showFlag, setShowModal, queData }) => {
  const token = useAuth();
  const queId = useParams();
  const [selectedQueId, setSelectedQueId] = useState("");
  const [errors, setErrors] = useState({});
  const selectData = Object.values(queData); // queDataを取得

  const closeModal = () => {
    setShowModal(false);
    setErrors({}); // エラーをリセット
  };

  const handleInputChange = (e) => {
    setSelectedQueId(e.target.value);
  };

  const handleDelete = async (ev) => {
    ev.preventDefault();
    const newErrors = {};
    if (!selectedQueId) newErrors.selectError = "アンケートを選択してください";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await Ajax(null, token.token, `questionnaire/${selectedQueId}`, 'delete');
      if (data.status === "success") {
        closeModal();
        swal.fire({
          title: '完了',
          text: '削除が完了しました！',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        console.error(data.message);
        
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      swal.fire({
        title: '失敗',
        text: 'もう一度お試しください',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  const isButtonDisabled = !selectedQueId; // ボタンの無効化条件

  return (
    <>
      {showFlag && (
        <div className={overlay} style={overlay}>
          <div className={modalContent} style={modalContent}>
            <div className={styles.titleArea}>
              <h2>削除するアンケートの選択</h2>
              <button className={styles.closeButton} onClick={closeModal}>×</button>
            </div>
            <div className={styles.formArea}>
              <form onSubmit={handleDelete} className={styles.addForm}>
                <dl className={styles.addInnerForm}>
                  <div className={styles.addStudentForm}>
                    <dt>
                      <label htmlFor="que">アンケートの選択</label>
                    </dt>
                    <dd>
                      <select id="que" onChange={handleInputChange} className={styles.teams} required>
                        <option value="">アンケートを選択してください</option>
                        {selectData.length > 0 && selectData.map((que) => (
                          <option key={que.id} value={que.id}>{que.title}</option>
                        ))}
                      </select>
                      {errors.selectError && <span className={styles.error}>{errors.selectError}</span>}
                    </dd>
                  </div>
                  <button 
                    type="submit" 
                    className={`${isButtonDisabled ? styles.disabled : styles.submitButton}`} 
                    disabled={isButtonDisabled}
                  >
                    削除の確定
                  </button>
                </dl>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const modalContent = {
  background: "white",
  width: "500px",
  height: "300px",
  padding: "10px",
  borderRadius: "10px",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default DeleteModal;
