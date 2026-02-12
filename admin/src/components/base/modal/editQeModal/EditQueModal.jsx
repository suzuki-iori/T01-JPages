import React, { useState, useEffect } from 'react';
import Ajax from '../../../../hooks/Ajax';
import Swal from 'sweetalert2';
import { useAuth } from '../../../../context/AuthContext';
import styles from './EditQueModal.module.css';

const EditQueModal = (props) => {
  const token = useAuth();
  const { showFlag, items = [], setShowModal } = props;
  const initialTarget = items.length > 0 ? items[0] : null;

  const [selectedId, setSelectedId] = useState(initialTarget ? String(initialTarget.id) : '');
  const [question, setQuestion] = useState(initialTarget ? (initialTarget.question || initialTarget.title || '') : '');
  const [isString, setIsString] = useState(initialTarget ? Number(initialTarget.isstring) === 1 : true);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!showFlag) return;
    const target = items.length > 0 ? items[0] : null;
    if (target) {
      setSelectedId(String(target.id));
      setQuestion(target.question || target.title || '');
      setIsString(Number(target.isstring) === 1);
      setNotice(null);
    }
  }, [showFlag, items]);

  const handleSelectChange = (e) => {
    const newId = e.target.value;
    setSelectedId(newId);
    setNotice(null);

    const target = items.find(it => String(it.id) === newId);
    if (target) {
      setQuestion(target.question || target.title || '');
      setIsString(Number(target.isstring) === 1);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNotice(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    if (selectedId === '') {
      setNotice({ text: '編集する項目が見つかりません', type: 'error' });
      return;
    }

    const originalItem = items.find(it => String(it.id) === selectedId);
    if (!originalItem) {
      setNotice({ text: 'データの取得に失敗しました', type: 'error' });
      return;
    }

    const req = {
      questionnaire_id: originalItem.questionnaire_id,
      question: question,
      isstring: isString ? 1 : 0,
      order: originalItem.order || 0
    };

    Ajax(null, token.token, `survey/${originalItem.id}`, 'put', req)
      .then((data) => {
        if (data.status === 'success') {
          Swal.fire({
            title: '完了',
            text: '更新しました',
            icon: 'success',
            confirmButtonText: '閉じる'
          }).then(() => {
            closeModal();
          });
        } else {
          setNotice({ text: '更新に失敗しました', type: 'error' });
        }
      })
      .catch(err => {
        console.error(err);
        setNotice({ text: 'システムエラーが発生しました。', type: 'error' });
      });
  };

  if (!showFlag) return null;

  const selectedItem = items.find(it => String(it.id) === selectedId) || (selectedId === '' && items.length > 0 ? items[0] : null);
  const displayQuestion = question || (selectedItem ? (selectedItem.question || selectedItem.title || '') : '');

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <div className={styles.titleArea}>
          <h2>質問を編集</h2>
          <button className={styles.closeButton} onClick={closeModal} type="button">×</button>
        </div>

        {notice && (
          <div style={{
            padding: '8px',
            margin: '8px 0',
            borderRadius: 4,
            color: notice.type === 'error' ? '#7a0000' : '#063',
            background: notice.type === 'error' ? '#fff1f0' : '#f0fff4'
          }}>{notice.text}</div>
        )}

        <form onSubmit={handleEdit}>
          <div className={styles.formGroup}>
            <label htmlFor="selectQuestion">編集する項目を選択</label>
            <select
              id="selectQuestion"
              className={styles.input}
              value={selectedId}
              onChange={handleSelectChange}
            >
              {items && items.map((it) => (
                <option key={it.id} value={String(it.id)}>
                  {it.question || it.title}
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
              value={displayQuestion}
              onChange={(e) => { setQuestion(e.target.value); setNotice(null); }}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="editIsString">回答タイプ</label>
            <select
              id="editIsString"
              className={styles.input}
              value={isString ? '1' : '0'}
              onChange={(e) => { setIsString(e.target.value === '1'); setNotice(null); }}
            >
              <option value="1">テキスト</option>
              <option value="0">数値</option>
            </select>
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