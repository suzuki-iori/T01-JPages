import React, { useState } from 'react';
import Ajax from "../../../../hooks/Ajax";
import styles from './EditStudentModal.module.css';
import { useAuth } from "../../../../context/AuthContext";
import swal from 'sweetalert2';



const EditStudentModal = ({ showFlag, setShowModal,teamData }) => {
    const token = useAuth();
    const [putTeamNum, setPutTeamNum] = useState("");
    const [putGrade, setPutGrade] = useState("");
    const [putStudentId, setPutStudentId] = useState("");
    const [putName, setPutName] = useState("");
    const [errors, setErrors] = useState({});
    const selectData = Object.values(teamData);

    const closeModal = () => {
        setShowModal(false);
        setErrors({}); // エラーをリセット
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const newErrors = {};

        if (!putStudentId) newErrors.idNumber = "学籍番号を入力してください";
        if (!putName) newErrors.name = "氏名を入力してください";
        if (!putGrade) newErrors.grade = "学年を選択してください";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const req = { team_id: Number(putTeamNum), number: putStudentId, grade: Number(putGrade), name: putName };

        try {
            const data = await Ajax(null, token.token, 'student', 'put', req);
            if (data.status === "success") {
                closeModal();
                swal.fire({
                    title: '完了',
                    text: '情報の変更が完了しました',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
                  
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
    };

    const isButtonDisabled = !putStudentId || !putName || !putGrade;

    return (
        <>
            {showFlag && (
                <div className={overlay} style={overlay}>
                    <div className={modalContent} style={modalContent}>
                        <div className={styles.titleArea}>
                            <h2>変更内容を入力してください</h2>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>
                        <div className={styles.formArea}>
                            <form onSubmit={handleSubmit}  className={styles.addForm} >
                            <dl className={styles.addInnerForm}>
                                <div className={styles.addStudentForm}>
                                    <dt>
                                        <label htmlFor="teams">チーム番号</label>
                                    </dt>
                                    <dd>
                                        <select id="teams" onChange={handleInputChange(setPutTeamNum)} className={styles.teams} required>
                                            <option value="">チームを選択してください</option>
                                            {selectData.length > 0 && selectData.map((team) => (
                                                <option key={team.id} value={team.id}>{team.name}</option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                                <div className={styles.addStudentForm}>
                                    <dt>
                                        <label htmlFor="StudentID">学籍番号</label>
                                    </dt>
                                    <dd>
                                        <input type="text" id="StudentID" maxLength={8} onChange={handleInputChange(setPutStudentId)} required />
                                        {errors.idNumber && <span className={styles.error}>{errors.idNumber}</span>}
                                    </dd>
                                </div>
                                <div className={styles.addStudentForm}>
                                    <dt>
                                        <label htmlFor="grade">学年</label>
                                    </dt>
                                    <dd>
                                        <input type="number" id="grade" max={3} min={1} onChange={handleInputChange(setPutGrade)} required />
                                        {errors.grade && <span className={styles.error}>{errors.grade}</span>}
                                    </dd>
                                </div>
                                <div className={styles.addStudentForm}>
                                    <dt>
                                        <label htmlFor="studentName">氏名</label>
                                    </dt>
                                    <dd>
                                        <input type="text" id="studentName" maxLength={15} onChange={handleInputChange(setPutName)} required />
                                        {errors.name && <span className={styles.error}>{errors.name}</span>}
                                    </dd>
                                </div>
                                <button 
                                        type="submit" 
                                        className={`${isButtonDisabled ? styles.disabled : styles.submitButton}`} 
                                        disabled={isButtonDisabled}
                                    >
                                        変更の確定
                                    </button>
                                </dl>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const modalContent = {
    background: "white",
    width: "500px",
    height: "550px",
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


export default EditStudentModal;
