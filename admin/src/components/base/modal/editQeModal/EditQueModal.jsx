import React, { useState, useEffect } from 'react';
import Ajax from '../../../../hooks/Ajax';
import { useAuth } from '../../../../context/AuthContext';
import styles from './EditQueModal.module.css';

const EditQueModal = (props) => {
  const token = useAuth();

  const initialTarget = props.item || (props.items && props.items.length > 0 ? props.items[0] : null);

  const [selectedId, setSelectedId] = useState(initialTarget ? initialTarget.id : '');
  const [question, setQuestion] = useState(initialTarget ? (initialTarget.question || initialTarget.title || '') : '');

  useEffect(() => {
    if (props.showFlag && props.items && props.items.length > 0) {
      const target = props.item || props.items[0];
      if (target) {
        setSelectedId(target.id);
        setQuestion(target.question || target.title || '');
      }
    }
  }, [props.showFlag, props.item, props.items]);

  const handleSelectChange = (e) => {
    const newId = parseInt(e.target.value, 10);
    setSelectedId(newId);
    const target = props.items.find(item => item.id === newId);
    if (target) {
      setQuestion(target.question || target.title || '');
    }
  };

  const closeModal = () => {
    props.setShowModal(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    if (!selectedId) {
      alert("編集する項目が見つかりません");
      return;
    }

    const originalItem = props.items.find(item => item.id === selectedId);

    if (!originalItem) {
      alert("データの取得に失敗しました");
      return;
    }

    const req = {
      questionnaire_id: originalItem.questionnaire_id,
      question: question,
      isstring: originalItem.isstring, 
    };

    Ajax(null, token.token, `survey/${selectedId}`, 'put', req)
      .then((data) => {
        if (data.status === "success") {
          window.location.reload(); 
          closeModal();
        } else {
          alert("更新に失敗しました");
        }
      })
      .catch(err => {
        console.error("更新エラー:", err);
        alert("システムエラーが発生しました。");
      });
  };

  if (!props.showFlag) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <div className={styles.titleArea}>
          <h2>質問を編集</h2>
          <button className={styles.closeButton} onClick={closeModal} type="button">×</button>
        </div>
        
        <form onSubmit={handleEdit}>
          <div className={styles.formGroup}>
            <label htmlFor="selectQuestion">編集する項目を選択</label>
            <select
              id="selectQuestion"
              className={styles.input}
              value={selectedId}
              onChange={handleSelectChange}
            >
              {props.items && props.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.question || item.title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="editQuestion">質問内容の変更</label>
            <input 
              id="editQuestion"
              type="text" 
              className={styles.input}
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            変更を保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQueModal;