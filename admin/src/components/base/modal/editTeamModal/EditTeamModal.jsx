import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useParams } from 'react-router-dom';
import styles from './EditTeamModal.module.css';
import swal from 'sweetalert2';


const EditTeamModal = (props) => {
    const token = useAuth();   
    const queId = useParams();
    const [putNum, setPutNum] = useState("");
    const [putName, setPutName] = useState("");
    const [putDetail, setPutDetail] = useState("");
    const [logoFile, setLogoFile] = useState();
    const [numError, setNumError] = useState("");
    const [nameError, setNameError] = useState("");
    const [detailError, setDetailError] = useState("");
    const [teamGrade, setTeamGrade] = useState('');

    console.log(props);
    
    const closeModal = () => {
        props.setShowModal(false);
    };  

    const inputTeamNum = (e) => {
        const value = e.target.value;
        if (value.length > 5) {
            setNumError("チーム番号は5文字以内で入力してください");
        } else {
            setNumError("");
        }
        setPutNum(value);
    };

    const inputTeamName = (e) => {
        const value = e.target.value;
        if (value.length > 20) {
            setNameError("システム名は20文字以内で入力してください");
        } else {
            setNameError("");
        }
        setPutName(value);
    };

    const inputTeamDetail = (e) => {
        const value = e.target.value;
        if (value.length > 100) {
            setDetailError("詳細は100文字以内で入力してください");
        } else {
            setDetailError("");
        }
        setPutDetail(value);
    };

    const handleGradeChange = (e) => {
        setTeamGrade(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            console.log(file);
            console.log(logoFile);
        }
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (numError || nameError || detailError) {
            return;
        }

        const formData = new FormData();
        formData.append('num', putNum || props.teamData.team.num);
        formData.append('logo', logoFile);
        formData.append('name', putName || props.teamData.team.name);
        formData.append('grade',  Number(teamGrade));
        formData.append('detail', putDetail || props.teamData.team.detail);
        const url = `https://jpages.jp/JPagesApi/public/api/team/${props.propsId}`;
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token.token}`,
            },
            body: formData,
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    closeModal();
                    swal.fire({
                        title: '完了',
                        text: '登録が完了しました！',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    console.log(data.status);
                    console.log(formData);
                } else {
                    console.log(data.status);
                    console.log(data.message);
                    console.log(token.token);
                    console.log(formData);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                swal.fire({
                    title: 'エラー',
                    text: 'エラーが発生しました。時間をおいてもう一度やり直してください',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });                  
            });
            closeModal();
        };
    
    return (
        <div id={styles.overlay} style={overlay}>
            <div id={styles.modalContent} style={modalContent}>
                <div className={styles.addModalTitleArea}>
                    <h2>登録情報の編集</h2>
                    <button className={styles.cancelButton} onClick={closeModal}><span>×</span></button>
                </div>
                <div className={styles.formArea}>
                    <form onSubmit={handleSubmit} className={styles.editForm}>
                        <dl className={styles.innerForm}>
                            <div className={styles.teamForm}>
                                <dt><label htmlFor="team">チーム番号</label></dt>
                                <dd>
                                    <input
                                        type="text"
                                        id="team"
                                        onChange={inputTeamNum}
                                        maxLength={5}
                                        value={putNum || props.teamData.team.num || ""}
                                        required
                                    />
                                </dd>
                                {numError && <span className={styles.error}>{numError}</span>} 
                            </div>
                            <div className={styles.teamForm}>
                                <dt><label htmlFor="system">システム名</label></dt>
                                <dd>
                                    <input
                                        type="text"
                                        id="system"
                                        onChange={inputTeamName}
                                        maxLength={20}
                                        value={putName || props.teamData.team.name || ""}
                                        required
                                    />
                                </dd>
                                {nameError && <span className={styles.error}>{nameError}</span>} 
                            </div>
                            <div className={styles.teamForm}>
                                <dt><label htmlFor="detail">詳細</label></dt>
                                <dd>
                                    <textarea
                                        id="detail"
                                        onChange={inputTeamDetail}
                                        maxLength={100}
                                        value={putDetail || props.teamData.team.detail || ""}
                                    />
                                </dd>
                                {detailError && <span className={styles.error}>{detailError}</span>} 
                            </div>
                            <div className={styles.teamForm}>
                                <dt><label htmlFor="logo">ロゴ画像</label></dt>
                                <dd>
                                    <input type="file" name="logo" accept='.png' onChange={handleFileChange} />                                </dd>
                            </div>
                            <div className={styles.selectArea}>
                                <dt><label htmlFor="select">学年</label></dt>
                                <dd>
                                    <select value={teamGrade} onChange={handleGradeChange} className={styles.checkText} required>
                                        <option value="">選択してください</option>
                                        <option value="2">2年</option>
                                        <option value="3">3年</option>
                                    </select>
                                </dd>
                            </div>
                            <button type="submit" className={styles.submitButton}>OK</button>
                        </dl>
                    </form>
                </div>
            </div>
        </div>
    );
};

const modalContent = {
    background: "white",
    width: "500px",
    height: "720px",
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

export default EditTeamModal;
