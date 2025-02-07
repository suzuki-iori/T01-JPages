import React from "react";
import styles from './StudentCSVAddModal.module.css';
import { useAuth } from "../../../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import Ajax from "../../../../hooks/Ajax";
import swal from 'sweetalert2';


const StudentCSVAddModal = (props) => {
    const token = useAuth();
    const navigate = useNavigate();
    const teamData = Object.values(props.selectData);
    const closeModal = () => {
        props.setShowCSVModal(false);
    };
    
    const [data, setData] = useState([]);
    const [fileSelected, setFileSelected] = useState(false); // ファイル選択状態

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileSelected(true); // ファイルが選択された
            Papa.parse(file, {
                header: true, 
                skipEmptyLines: true,
                complete: (results) => {
                    setData(results.data); 
                    console.log(results);
                },
                error: (error) => {
                    console.error("CSVパース中にエラー:", error);
                }
            });
        } else {
            setFileSelected(false); // ファイルが選択されていない
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault(); // デフォルトのフォーム送信を防ぐ
        try {
            for (const row of data) {
                const req = {
                    team_id: Number(row['チーム番号']),  
                    number: row['学籍番号'],
                    grade: Number(row['学年']),
                    name: row['氏名'],
                };
                console.log(req);
                console.log(token);
                
                const response = await Ajax(null, token.token, 'student', 'post', req);
                if(response.status === "success") {
                    console.log("登録成功");
                } else {
                    console.log(response.status);
                    console.log(response.message);
                    console.log(token.token);
                    console.log(req);
                }   
            }
            swal.fire({
                title: '登録完了',
                text: 'すべての登録が完了しました',
                icon: 'success',
                confirmButtonText: 'OK'});
            closeModal();
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
    };

    // CSVファイルをダウンロードする関数
    const handleDownload = () => {
        const dataToDownload = [
            {
                "チーム番号": 1,
                "学籍番号": "99jz9999",
                "学年": 3,
                "氏名": "田中太郎"
            }
        ];

        const csvData = [
            ["チーム番号", "学籍番号", "学年", "氏名"], // ヘッダー
            ...dataToDownload.map(item => [item["チーム番号"], item["学籍番号"], item["学年"], item["氏名"]]) // データ行
        ];

        const csvContent = csvData.map(e => e.join(",")).join("\n"); // CSV形式に変換
        const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // BOMを追加
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Jpages.csv"); // ダウンロードするファイル名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
    <>
    {props.showFlag ? (
    <div id={styles.overlay} style={overlay}>
        <div id={styles.addModalContent} style={modalContent}>
           <div className={styles.addModalTitleArea}>
                <p>登録するCSVファイルを選択してください</p>
                <button className={styles.cancelButton} onClick={closeModal}><span>×</span></button>
           </div>
           <div className={styles.selectFileArea}>
                <form action="" className={styles.csvForm}>
                    <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    />
                    <button 
                        onClick={handleUpload} 
                        className={!fileSelected ? styles.disabled : styles.submitButton} 
                        disabled={!fileSelected}
                    >
                        登録
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDownload} 
                        className={styles.downloadButton}
                    >
                        CSVファイルダウンロード
                    </button>
                </form>
           </div>
        </div>
    </div>
    ) : null}
    </>
    );
};

const modalContent = {
    background: "white",
    width: "500px",
    height: "300px",
    padding: "10px",
    borderRadius: "10px",
    opacity: 999,
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

export default StudentCSVAddModal;
