import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import styles from './DeleteModal.module.css';
import Ajax from '../../../../hooks/Ajax';
import swal from 'sweetalert2';

const DeleteModal = ({ showFlag, setShowModal, queData }) => {
  const token = useAuth();
  const [selectedId, setSelectedId] = useState(""); 
  const [errors, setErrors] = useState({});

  const selectData = queData || [];

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
    setSelectedId(""); // 選択状態もリセット
  };

  const handleInputChange = (e) => {
    setSelectedId(e.target.value);
  };

  const handleDelete = async (ev) => {
    ev.preventDefault();
    const newErrors = {};
    
    if (!selectedId) {
        newErrors.selectError = "削除する項目を選択してください";
        setErrors(newErrors);
        return;
    }
    const targetItem = selectData.find(item => item.id == selectedId);

    let endpoint = 'questionnaire'; 
    if (targetItem && targetItem.question) {
        endpoint = 'survey'; 
    }

    try {
      const data = await Ajax(null, token.token, `${endpoint}/${selectedId}`, 'delete');
      
      if (data.status === "success") {
        swal.fire({
          title: '完了',
          text: '削除が完了しました！',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
            closeModal();
            window.location.reload();
        });
      } else {
        console.error(data.message);
        swal.fire('エラー', '削除に失敗しました', 'error');
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

  const isButtonDisabled = !selectedId;

  return (
    <>
      {showFlag && (
        <div style={overlay}>
          <div style={modalContent}>
            <div className={styles.titleArea}>
              <h2>削除項目の選択</h2>
              <button className={styles.closeButton} onClick={closeModal} style={{border:'none', background:'transparent', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
            </div>
            <div className={styles.formArea}>
              <form onSubmit={handleDelete} className={styles.addForm}>
                <dl className={styles.addInnerForm}>
                  <div className={styles.addStudentForm}>
                    <dt>
                      <label htmlFor="que">削除する項目の選択</label>
                    </dt>
                    <dd>
                      <select id="que" onChange={handleInputChange} className={styles.teams} required value={selectedId}>
                        <option value="">選択してください</option>
                        {selectData.length > 0 && selectData.map((item) => (
                          <option key={item.id} value={item.id}>
                              {item.question ? item.question : item.title}
                          </option>
                        ))}
                      </select>
                      {errors.selectError && <span className={styles.error} style={{color:'red'}}>{errors.selectError}</span>}
                    </dd>
                  </div>
                  <button 
                    type="submit" 
                    className={styles.submitButton} 
                    disabled={isButtonDisabled}
                    style={{opacity: isButtonDisabled ? 0.5 : 1, marginTop: '20px'}}
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