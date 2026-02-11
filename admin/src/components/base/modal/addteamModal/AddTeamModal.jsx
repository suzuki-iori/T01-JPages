import React, { useState, useCallback } from 'react';
import styles from './AddTeamModal.module.css';
import { useAuth } from '../../../../context/AuthContext';
import { API_BASE_URL } from '../../../../hooks/Ajax';
import swal from 'sweetalert2';

// 初期フォーム状態
const INITIAL_FORM_STATE = {
  num: '',
  name: '',
  detail: '',
  grade: '',
  logo: null,
};

// 学年オプション
const GRADE_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '2', label: '2年' },
  { value: '3', label: '3年' },
];

/**
 * チーム追加モーダルコンポーネント
 */
const AddTeamModal = ({ showFlag, setShowModal }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setFormData(INITIAL_FORM_STATE);
  }, [setShowModal]);

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('num', formData.num);
    submitData.append('name', formData.name);
    submitData.append('detail', formData.detail);
    submitData.append('grade', Number(formData.grade));
    if (formData.logo) {
      submitData.append('logo', formData.logo);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        closeModal();
        swal.fire({
          title: '完了',
          text: 'チームの追加が完了しました',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        swal.fire({
          title: 'エラー',
          text: data.message || 'チームの追加に失敗しました',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      swal.fire({
        title: 'エラー',
        text: '通信エラーが発生しました',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.num && formData.grade;

  if (!showFlag) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <div className={styles.addModalTitleArea}>
          <h2>新しいチームを作成します</h2>
          <button
            className={styles.cancelButton}
            onClick={closeModal}
            aria-label="閉じる"
          >
            <span>×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <dl className={styles.addInnerForm}>
            <div className={styles.addTeamTitleForm}>
              <dt><label htmlFor="name">システム名</label></dt>
              <dd>
                <input
                  type="text"
                  id="name"
                  name="name"
                  maxLength={30}
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </dd>

              <dt><label htmlFor="num">チーム番号 <span className={styles.required}>*</span></label></dt>
              <dd>
                <input
                  type="text"
                  id="num"
                  name="num"
                  maxLength={30}
                  value={formData.num}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  required
                />
              </dd>

              <dt><label htmlFor="detail">チーム詳細</label></dt>
              <dd>
                <textarea
                  id="detail"
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </dd>

              <dt><label htmlFor="logo">ロゴ画像</label></dt>
              <dd>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept=".png"
                  onChange={handleInputChange}
                />
              </dd>
              <dt><label htmlFor="grade">学年 <span className={styles.required}>*</span></label></dt>
              <dd>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={styles.checkText}
                  required
                >
                  {GRADE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </dd>
            </div>
            <button
              type="submit"
              className={!isFormValid || isSubmitting ? styles.disabled : styles.submitButton}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? '送信中...' : 'OK'}
            </button>
          </dl>
        </form>
      </div>
    </div>
  );
};

export default AddTeamModal;
