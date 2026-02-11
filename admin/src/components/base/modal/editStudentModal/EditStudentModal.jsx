import React, { useState, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import styles from './EditStudentModal.module.css';
import { API_BASE_URL } from '../../../../hooks/Ajax';
import swal from 'sweetalert2';

const EditStudentModal = ({ showFlag, setShowModal, teamData, studentData, onSuccess }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        team_id: null,
        number: null,
        grade: null,
        name: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    const selectData = teamData ? Object.values(teamData) : [];

    // フィールドの値を取得（nullの場合はstudentDataを使用）
    const getFieldValue = (fieldName) => {
        if (formData[fieldName] !== null) {
            return formData[fieldName];
        }
        return studentData?.student?.[fieldName] ?? '';
    };

    const closeModal = useCallback(() => {
        setShowModal(false);
        setFormData({
            team_id: null,
            number: null,
            grade: null,
            name: null,
        });
        setApiError('');
    }, [setShowModal]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
        setApiError('');

        const req = {
            team_id: Number(getFieldValue('team_id')) || null,
            number: getFieldValue('number'),
            grade: Number(getFieldValue('grade')),
            name: getFieldValue('name'),
        };

        // team_idが0や空の場合は削除
        if (!req.team_id) {
            delete req.team_id;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/student/${studentData?.student?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(req),
            });

            const data = await response.json();

            if (data.status === 'success') {
                closeModal();
                if (onSuccess) {
                    onSuccess();
                }
                swal.fire({
                    title: '完了',
                    text: '情報の変更が完了しました',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                setApiError(data.message || '更新に失敗しました');
            }
        } catch (error) {
            console.error('Error:', error);
            setApiError('通信エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = getFieldValue('number') &&
                        getFieldValue('name') &&
                        getFieldValue('grade');

    if (!showFlag) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.addModalTitleArea}>
                    <h2>学生情報の編集</h2>
                    <button className={styles.cancelButton} onClick={closeModal} aria-label="閉じる">
                        <span>×</span>
                    </button>
                </div>

                {apiError && <div className={styles.apiError}>{apiError}</div>}

                <form onSubmit={handleSubmit}>
                    <dl className={styles.addInnerForm}>
                        <div className={styles.addStudentTitleForm}>
                            <dt><label htmlFor="team_id">所属チーム</label></dt>
                            <dd>
                                <select
                                    id="team_id"
                                    name="team_id"
                                    value={getFieldValue('team_id')}
                                    onChange={handleInputChange}
                                    className={styles.selectField}
                                >
                                    <option value="">チームを選択してください</option>
                                    {selectData.length > 0 && selectData.map((team) => (
                                        <option key={team.id} value={team.id}>{team.name || team.num}</option>
                                    ))}
                                </select>
                            </dd>

                            <dt><label htmlFor="number">学籍番号 <span className={styles.required}>*</span></label></dt>
                            <dd>
                                <input
                                    type="text"
                                    id="number"
                                    name="number"
                                    maxLength={8}
                                    value={getFieldValue('number')}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                            </dd>

                            <dt><label htmlFor="name">氏名 <span className={styles.required}>*</span></label></dt>
                            <dd>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    maxLength={15}
                                    value={getFieldValue('name')}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    required
                                />
                            </dd>

                            <dt><label htmlFor="grade">学年 <span className={styles.required}>*</span></label></dt>
                            <dd>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={getFieldValue('grade')}
                                    onChange={handleInputChange}
                                    className={styles.selectField}
                                    required
                                >
                                    <option value="">選択してください</option>
                                    <option value="2">2年</option>
                                    <option value="3">3年</option>
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

export default EditStudentModal;
