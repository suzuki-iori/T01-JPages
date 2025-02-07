import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Detail.module.css";
import Header from "../../../common/header/Header";
import RoutingSidebar from "../../../common/sidebar/RoutingSidebar";
import useSetSidebar from '../../../../hooks/useSetSidebar';
import useSetUrlPath from '../../../../hooks/useSetUrlPath';
import TeamDetail from "../../../common/teamdetail/TeamDetail";
import useRequireAuth from '../../../../hooks/useRequireAuth';
import Ajax from "../../../../hooks/Ajax";
import { useAuth } from '../../../../context/AuthContext';

const Detail = () => {
  useRequireAuth();
  const token = useAuth();
  const navigate = useNavigate();
  const [team_id,setTeam_id] = useState();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [lastTeamId, setLastTeamId] = useState(null); // lastTeamIdを状態として定義
  const { checkbool, toggleSidebar } = useSetSidebar(); 
  const mypath = useSetUrlPath(); 

  useEffect(() => {
    Ajax(null, token.token, 'team', 'get')
      .then((data) => {
        if (data.status === "success") {
          setData(data.team || []);
          console.log("データ取得成功");

          const arrayLast = data.team.slice(-1)[0]; // 修正: data.teamを使う
          setLastTeamId(arrayLast ? arrayLast.id : null); // lastTeamIdを設定
          setTeam_id(id);
          if (id > (arrayLast ? arrayLast.id : 0)) {
            navigate('/admin/NoTeam');
          }
        } else {
          console.log(data.status);
        }
      });
  }, [id, navigate, token]);

  // lastTeamIdがまだ取得できていない場合は何も表示しない
  if (lastTeamId === null) {
    return null;
  }

  return (
    <>
      <Header toggleSidebar={toggleSidebar} path={mypath} />
      <div className={styles.flex}>
        <RoutingSidebar checkbool={checkbool} />
        <div className={styles.detailArea}>
          <TeamDetail id={team_id}/>
        </div>
      </div>
    </>
  );
};

export default Detail;
