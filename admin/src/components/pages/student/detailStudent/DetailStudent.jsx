import React, { useState,useEffect } from 'react'
import styles from './DetailStudent.module.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import Header from '../../../common/header/Header';
import RoutingSidebar from '../../../common/sidebar/RoutingSidebar';
import  StDetail  from '../../../common/studentdetail/StDetail';
import useSetSidebar from '../../../../hooks/useSetSidebar';
import useSetUrlPath from '../../../../hooks/useSetUrlPath';
import useRequireAuth from '../../../../hooks/useRequireAuth';
import Ajax from '../../../../hooks/Ajax';

export default function DetailStudent() {
    useRequireAuth();
    const token = useAuth();
    const { id } = useParams();
    const {checkbool,toggleSidebar} = useSetSidebar();
    const mypath = useSetUrlPath();
    const [studentData,setStudentData] = useState();
    console.log(id);
    useEffect(() => {
    Ajax(null, token.token, `student/${id}`, 'get')
    .then((data) => {
        if (data.status === "success") {
            console.log(data);
            setStudentData(data);
        } else {
            swal.fire({
                title: 'エラー',
                text: 'エラーが発生しました。もう一度お試しください',
                icon: 'warning',
                confirmButtonText: 'OK'
            });              
        }
    });
}, [token]);
    return (
    <>
    <Header toggleSidebar={toggleSidebar} path={mypath}/>
        <div className={styles.flex}>
            <RoutingSidebar checkbool={checkbool}/>
            <StDetail stData={studentData} />
        </div>
    </>
    )
}
