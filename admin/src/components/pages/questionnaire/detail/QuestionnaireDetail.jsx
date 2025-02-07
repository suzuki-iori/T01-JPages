import React from 'react'
import Header from '../../../common/header/Header';
import RoutingSidebar from '../../../common/sidebar/RoutingSidebar';
import { useParams, useNavigate } from "react-router-dom";
import useSetSidebar from '../../../../hooks/useSetSidebar';
import useSetUrlPath from '../../../../hooks/useSetUrlPath';
import styles from './QuestionnaireDetail.module.css';
import QeDetail from '../../../common/questionnairedetail/QeDetail';
// import 

const QuestionnaireDetail = () => {
    const {checkbool,toggleSidebar} = useSetSidebar();
    const mypath = useSetUrlPath();
    return (
        <>
            <Header toggleSidebar={toggleSidebar} path={mypath}/>
            <div className={styles.flex}>
                <RoutingSidebar checkbool={checkbool}/>
                {/* <QuestionnaireDetail/> */}
                <QeDetail/>
            </div>
        </>
        )
}

export default QuestionnaireDetail