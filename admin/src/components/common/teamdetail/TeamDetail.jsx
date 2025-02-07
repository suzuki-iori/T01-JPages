import React, { useState , useEffect} from 'react';
import styles from './TeamDetail.module.css'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { EditButton } from '../../base/editButton/EditButton';
import Ajax from '../../../hooks/Ajax';
import EditTeamModal from '../../base/modal/editTeamModal/EditTeamModal';
import DeleteTeamModal from '../../base/modal/deleteTeamModal/DeleteTeamModal';
import ReactLoading from "react-loading";
import { Button, CircularProgress } from '@mui/material';


export default function TeamDetail(props) {
    const [teamDetail,setTeamDetail] = useState();
    const token = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    console.log(showModal);
    const ShowModal = () => {
        fetchTeamData();
        setShowModal(true);
        console.log(showModal);
    };

    const ShowDeleteModal = () =>{
        fetchTeamData();
        setShowDeleteModal(true);
        console.log(showDeleteModal);
    }
    const fetchTeamData = () => {
        Ajax(null, null, `team/${props.id}`, 'get')
        .then((data) => {
            if (data.status === "success") {
            setTeamDetail(data );
            console.log("データ取得成功");
            console.log(data);
        } else {
            console.log(data.status);
        }
        });
    }

    useEffect(() => {
        fetchTeamData();
    }, []);

    return (
        <>
            <div className={styles.teamDetailArea}>
                    {showModal && (
                <EditTeamModal 
                    showFlag={showModal} 
                    setShowModal={setShowModal} 
                    propsId={props.id}
                    teamData={teamDetail}
                />
                )}
                {showDeleteModal && (
                <DeleteTeamModal 
                    showFlag={showDeleteModal} 
                    setShowDeleteModal={setShowDeleteModal} 
                    propsId={props.id}
                    teamData={teamDetail}
                />
                )}
                {/* <EditTeamModal showFlag={showModal} setShowModal={setShowModal} propsId={props.id}/> */}
                <div className={styles.titleAndButton}>
                    <h1> チーム情報</h1>
                    <div className={styles.buttonWrapper}>
                        <Button variant="contained" color="primary" onClick={ShowModal} style={{height:'40px',background:'#37ab9d'}}>編集</Button>
                        <Button variant="contained" color="primary" onClick={ShowDeleteModal} style={{height:'40px',background:'#f01e1e',}}>削除</Button>
                    </div>
                </div>
                <div className={styles.expArea}>
                    <p>チームの基本情報などの情報を入力します</p>
                    <small className={styles.smallp}>※編集する場合は右上のボタンを押してください</small>
                </div>
                <div className={styles.inputArea}>
                    {teamDetail ? (
                        <div className={styles.teamText}>
                            <div>
                                <span>チーム番号</span>
                                <p>{teamDetail.team.num}</p>
                            </div>
                            <div>
                                <span>システム名</span>
                                <p>{teamDetail.team.name || '情報がありません'}</p>
                            </div>
                            <div>
                                <span>メンバー</span>
                                {teamDetail.team.students.map((student)=>(
                                <p>{student.grade + "年  " + student.name}</p>
                                ))}
                            </div>
                            <div>
                                <span>詳細</span>
                                <p>{teamDetail.team.detail || '詳細情報がありません'}</p>
                            </div>
                        </div>
                    ) : (
                        <CircularProgress />
                        )}
                    <div className={styles.teamImage}>
                        <div>
                            <span>ロゴ画像</span>
                            <img src="" alt="チームロゴ" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}