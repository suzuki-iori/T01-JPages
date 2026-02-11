import React, { useState, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import styles from './EditTeamModal.module.css';
import { API_BASE_URL } from '../../../../hooks/Ajax';
import swal from 'sweetalert2';

// 学年オプション
const GRADE_OPTIONS = [
    { value: '', label: '選択してください' },
    { value: '2', label: '2年' },
    { value: '3', label: '3年' },
];

const EditTeamModal = ({ showFlag, setShowModal, propsId, teamData }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        num: '',
        name: '',
        detail: '',
        grade: '',
        logo: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const closeModal = useCallback(() => {
        setShowModal(false);
        setFormData({
            num: '',
            name: '',
            detail: '',
            grade: '',
            logo: null,
        });
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
        submitData.append('_method', 'PUT');
        submitData.append('num', formData.num || teamData.team.num);
        submitData.append('name', formData.name || teamData.team.name || '');
        submitData.append('detail', formData.detail || teamData.team.detail || '');
        submitData.append('grade', formData.grade || teamData.team.grade);
        if (formData.logo) {
            submitData.append('logo', formData.logo);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/team/${propsId}`, {
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
                    text: '登録が完了しました！',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                swal.fire({
                    title: 'エラー',
                    text: data.message || '更新に失敗しました',
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

    const isFormValid = (formData.num || teamData?.team?.num) && (formData.grade || teamData?.team?.grade);

    if (!showFlag) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContent}>
                <div className={styles.addModalTitleArea}>
                    <h2>登録情報の編集</h2>
                    <button className={styles.cancelButton} onClick={closeModal} aria-label="閉じる">
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
                                    value={formData.name || teamData?.team?.name || ''}
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
                                    value={formData.num || teamData?.team?.num || ''}
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
                                    value={formData.detail || teamData?.team?.detail || ''}
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
                                    value={formData.grade || teamData?.team?.grade || ''}
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

export default EditTeamModal;
