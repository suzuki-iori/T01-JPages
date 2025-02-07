import React from 'react';
import Header from "../../common/header/Header";
import RoutingSidebar from '../../common/sidebar/RoutingSidebar';
import useSetSidebar from '../../../hooks/useSetSidebar';
import styles from './dashboard.module.css'
import useSetUrlPath from '../../../hooks/useSetUrlPath';
import useRequireAuth from '../../../hooks/useRequireAuth';
import { Graphs } from '../../common/graph/Graphs';

const dashboard = () => {
    useRequireAuth();
    const {checkbool,toggleSidebar} = useSetSidebar();
    const mypath = useSetUrlPath();
    return (
    <>
    <Header toggleSidebar={toggleSidebar} path={mypath}/>
        <div className={styles.flex}>
        <RoutingSidebar checkbool={checkbool}/>
        <Graphs/>
        </div>
    </>
    )
}

export default dashboard