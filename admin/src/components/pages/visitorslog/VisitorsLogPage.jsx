import React from 'react'
import Header from "../../common/header/Header";
import RoutingSidebar from '../../common/sidebar/RoutingSidebar';
import useSetSidebar from '../../../hooks/useSetSidebar';
import Visitor from '../../common/visitor/Visitor';
import styles from "./VisitorsLogPage.module.css"
import useSetUrlPath from '../../../hooks/useSetUrlPath';
import useRequireAuth from '../../../hooks/useRequireAuth';

const VisitorsLogPage = () => {
  // const location = useLocation();
  useRequireAuth();
  const {checkbool,toggleSidebar} = useSetSidebar();
  const mypath = useSetUrlPath();
  return (
  <>
  <Header toggleSidebar={toggleSidebar} path={mypath}/>
  <div className={styles.flex}>
    <RoutingSidebar checkbool={checkbool}/>
    <Visitor className={styles.Visitor}/>
  </div>
</>
  )
}

export default VisitorsLogPage
