import React, { useEffect, useState } from 'react';
// Chip を追加インポート
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Chip } from '@mui/material';
import { Link } from "react-router-dom";
import Ajax from '../../../hooks/Ajax';
import { useAuth } from '../../../context/AuthContext';
import QuestionnaireModal from '../../base/modal/questionnaireModall/questionnaireModal';
import styles from './QuestionnaireList.module.css';
import DeleteModal from '../../base/modal/deleteModal/DeleteModal';

const QuestionnaireList = () => {
    const token = useAuth();
    const [queData, setQueData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const ShowModal = () => {
        setShowModal(true);
    };
    const ShowDeleteModal = () => {
        setShowDeleteModal(true);
    };
    
    const fetchData = () => {
        
        Ajax(null, token.token, 'questionnaire', 'get')
            .then((data) => {
                if (data.status === "success") {                    
                    setQueData(data.questionnaire || []);   
                } else {
                    console.log(data.status);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); 

        return () => clearInterval(interval); 
    }, [token.token]);

    return (
        <>
            <div className={styles.listArea}>
                <div className={styles.pageTitle}>
                    <h2>アンケート一覧</h2>
                </div>
                <div className={styles.processingArea}>
                    <div className={styles.innerProcessing}>
                        <Button variant="contained" color="primary" onClick={ShowModal} style={{ marginLeft: '20px' }}>
                            + 新規登録
                        </Button>
                        <Button variant="contained" onClick={ShowDeleteModal} style={{ marginLeft: '20px', backgroundColor: 'red' }}>
                            削除
                        </Button>
                    </div>
                </div>

                {showModal && (
                    <QuestionnaireModal showFlag={showModal} setShowModal={setShowModal} />
                )}

                {showDeleteModal && (
                    <DeleteModal showFlag={showDeleteModal} setShowModal={setShowDeleteModal} queData={queData || []} />
                )}

                <div className={styles.questionnaireListArea}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>タイトル</TableCell>
                                    <TableCell align="center" style={{ width: '120px' }}>ステータス</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && queData.length === 0 ? ( // 初回ロード時のみスピナーを出すように条件を少し調整推奨
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <CircularProgress />
                                            <p>ロード中...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : queData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                                            <p>該当するデータは見つかりませんでした。</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    queData.map((que) => (                  
                                        <TableRow key={que.id} component={Link} to={`/admin/questionnairedetail/${que.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <TableCell>{que.title}</TableCell>

                                            <TableCell align="center">
                                                {que.is_active ? (
                                                    <Chip label="公開中" color="success" size="small" variant="filled" />
                                                ) : (
                                                    <Chip label="非公開" size="small" variant="outlined" />
                                                )}
                                            </TableCell>
                                            
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    );
}

export default QuestionnaireList;