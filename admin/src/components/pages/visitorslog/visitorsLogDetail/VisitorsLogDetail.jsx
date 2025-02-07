import React from 'react'
import Header from '../../../common/header/Header'
import useSetUrlPath from '../../../../hooks/useSetUrlPath';
import useRequireAuth from '../../../../hooks/useRequireAuth';
import useSetSidebar from '../../../../hooks/useSetSidebar';
import RoutingSidebar from '../../../common/sidebar/RoutingSidebar';
import styles from "./VisitorsLogDetail.module.css"
import VisitorDetail from '../../../common/visitorDetail/VisitorDetail';

const VisitorsLogDetail = () => {
  useRequireAuth();
  const {checkbool,toggleSidebar} = useSetSidebar();
  const mypath = useSetUrlPath();
  return (
    <>
      <Header toggleSidebar={toggleSidebar} path={mypath}/>
      <div className={styles.flex}>
        <RoutingSidebar checkbool={checkbool}/>
        <VisitorDetail/>
      </div>
    </>
  )
}

export default VisitorsLogDetail