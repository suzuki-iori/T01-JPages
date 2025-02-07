import React from 'react';
import Header from "../../common/header/Header";
import RoutingSidebar from '../../common/sidebar/RoutingSidebar';
import { Team } from '../../common/team/Team';
import styles from "./MainTeamPage.module.css";
import useSetSidebar from '../../../hooks/useSetSidebar';
import useSetUrlPath from '../../../hooks/useSetUrlPath';
import useRequireAuth from '../../../hooks/useRequireAuth';


export default function MainTeamPage() {
  useRequireAuth();
// console.log("ここはチーム一覧");
const {checkbool,toggleSidebar} = useSetSidebar();
const mypath = useSetUrlPath();
return (
<>
<Header toggleSidebar={toggleSidebar} path={mypath}/>
      <div className={styles.flex}>
        <RoutingSidebar checkbool={checkbool}/>
        <Team/>
      </div>
      
</>
  )
}
