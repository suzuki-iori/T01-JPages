import React from "react";
import styles from "./graphs.module.css";
import { useState, useEffect } from "react";
import { VisitorPie } from "./graphs/VisitorPie";
import VisitorCounter from "./graphs/VisitorCounter";
import RealTimeChart from "./graphs/RealTimeChart ";
import { LegendList } from "./graphs/LegendList";
import { useAuth } from '../../../context/AuthContext';
import Ajax from "../../../hooks/Ajax";
import TestModel from "./graphs/TestModel";
import TeanRanking from "./graphs/TeanRanking";

export const Graphs = () => {
  const token = useAuth();
  const [visitorData, setVisitorData] = useState();

  const fetchVisitorData = () => {
    Ajax(null, token.token, 'visitor', 'get')
      .then((data) => {
        if (data.status === "success") {
          setVisitorData(data);
          
          // console.log(data);
        } else {
          // fetchVisitorData();
          console.log("データ取得失敗");
        }
      });
  };

  useEffect(() => {
    fetchVisitorData();
  }, []);


  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.graphTop}>
          <VisitorPie data={visitorData} />
          <VisitorCounter/>
          <TeanRanking/>
        </div>
          <TestModel data={visitorData}/>
      </div>
    </>
  );
};
