import React, { useState, useEffect } from 'react';
import { EditButton } from '../../base/editButton/EditButton';
import styles from './StDetail.module.css';
import ReactLoading from "react-loading";
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

    const ShowModal = () => {
        setShowModal(true);
        Ajax(null, token.token, 'team', 'get')
        .then((data) => {
            if (data.status === "success") {
            setTeamData(data.team);
            } else {
            console.log(data.status);
            }
            setShowModal(true);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const ShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className={styles.studentDetailArea}>
                <div className={styles.titleAndEdit}>
                    <h1>基本情報</h1>
                    <EditButton onClick={ShowModal} />
                </div>
                <div className={styles.expArea}>
                    <p>登録されている学生の情報を確認・編集します</p>
                    <small className={styles.smallp}>※編集する場合は右上のボタンを押してください</small>
                </div>
                <EditStudentModal showFlag={showModal} setShowModal={setShowModal} teamData={teamData} />
                <StudentDeleteModal showFlag={showDeleteModal} setShowDeleteModal={setShowDeleteModal} data={detailData} />
                <div className={styles.detailArea}>
                    {detailData ? (
                        <div className={styles.studentText}>
                            <div>
                                <span>所属チーム</span>
                                <p>{detailData.student.team_id}</p>
                            </div>
                            <div>
                                <span>学年</span>
                                <p>{detailData.student.grade || '情報がありません'}年</p>
                            </div>
                            <div>
                                <span>学籍番号</span>
                                <p>{detailData.student.number || '情報がありません'}</p>
                            </div>
                            <div>
                                <span>氏名</span>
                                <p>{detailData.student.name || '情報がありません'}</p>
                            </div>
                            <div className={styles.deleteButtonWrapper}>
                                <button onClick={ShowDeleteModal} className={styles.delete}><p>削除</p></button>
                            </div>
                        </div>
                    ) : (
                        <ReactLoading type='spokes' color='#37ab9d' />
                    )}
                </div>
            </div>
        </>
    );
}
