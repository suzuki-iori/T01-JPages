import React, { useState, useEffect } from 'react';
import styles from './StDetail.module.css';
import { Button, CircularProgress } from '@mui/material';
import StudentDeleteModal from '../../base/modal/studentDeleteModal/StudentDeleteModal';
import EditStudentModal from '../../base/modal/editStudentModal/EditStudentModal';
import { useAuth } from '../../../context/AuthContext';
import Ajax from '../../../hooks/Ajax';

export default function StDetail(props) {
    const token = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teamData, setTeamData] = useState([]);

    const detailData = props.stData;
    const onRefresh = props.onRefresh;

    // チームデータを初期表示時に取得
    useEffect(() => {
        Ajax(null, token.token, 'team', 'get')
        .then((data) => {
            if (data.status === "success") {
                setTeamData(data.team);
            }
        });
    }, [token]);

    // チームIDからチーム名を取得
    const getTeamName = (teamId) => {
        if (!teamId) return '未割り当て';
        const team = teamData.find(t => t.id === teamId);
        return team ? (team.name || team.num) : teamId;
    };

    const ShowModal = () => {
        setShowModal(true);
    };

    const ShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className={styles.studentDetailArea}>
                <EditStudentModal showFlag={showModal} setShowModal={setShowModal} teamData={teamData} studentData={detailData} onSuccess={onRefresh} />
                <StudentDeleteModal showFlag={showDeleteModal} setShowDeleteModal={setShowDeleteModal} data={detailData} />
                <div className={styles.titleAndButton}>
                    <h1>学生情報</h1>
                    <div className={styles.buttonWrapper}>
                        <Button variant="contained" color="primary" onClick={ShowModal} style={{height:'40px',background:'#37ab9d'}}>編集</Button>
                        <Button variant="contained" color="primary" onClick={ShowDeleteModal} style={{height:'40px',background:'#f01e1e'}}>削除</Button>
                    </div>
                </div>
                <div className={styles.expArea}>
                    <p>登録されている学生の情報を確認・編集します</p>
                    <small className={styles.smallp}>※編集する場合は右上のボタンを押してください</small>
                </div>
                <div className={styles.inputArea}>
                    {detailData ? (
                        <div className={styles.studentText}>
                            <div>
                                <span>所属チーム</span>
                                <p>{getTeamName(detailData.student.team_id)}</p>
                            </div>
                            <div>
                                <span>学籍番号</span>
                                <p>{detailData.student.number || '情報がありません'}</p>
                            </div>
                            <div>
                                <span>氏名</span>
                                <p>{detailData.student.name || '情報がありません'}</p>
                            </div>
                            <div>
                                <span>学年</span>
                                <p>{detailData.student.grade ? `${detailData.student.grade}年` : '情報がありません'}</p>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress />
                    )}
                </div>
            </div>
        </>
    );
}
