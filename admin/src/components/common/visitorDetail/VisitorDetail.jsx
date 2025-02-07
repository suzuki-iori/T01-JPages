import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from "react-loading";
import Ajax from '../../../hooks/Ajax';
import { useAuth } from '../../../context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import styles from './VisitorDetail.module.css';

const VisitorDetail = () => {
  const [visitorDetail, setVisitorDetail] = useState();
  const [teamData, setTeamData] = useState();
  const params = useParams();
  const token = useAuth();

  const fetchVisitorData = () => {
    Ajax(null, token.token, `visitor/${params.id}`, 'get')
      .then((data) => {
        if (data.status === "success") {
          setVisitorDetail(data);
        } else {
          console.log(data.status);
        }
      });
  };

  const fetchTeamData = () => {
    Ajax(null, token.token, `team`, 'get')
      .then((data) => {
        if (data.status === "success") {
          setTeamData(data);
        } else {
          console.log(data.status);
        }
      });
  };

  useEffect(() => {
    fetchVisitorData();
    fetchTeamData();
  }, []);

  const getRatingsData = () => {
    if (!visitorDetail || !teamData) return [];

    return visitorDetail.visitor.ratings.map(rating => {
      const team = teamData.team.find(t => t.id === rating.team_id);
      return {
        teamName: team ? team.name : '不明',
        design: rating.design,
        plan: rating.plan,
        skill: rating.skill,
        present: rating.present,
        positive: rating.positive || '無記入',
        negative: rating.negative || '無記入',
        other: rating.other || '無記入'
      };
    });
  };

  const ratingsData = getRatingsData();

  return (
    <>
      <div className={styles.visitorDetailArea}>
        <div className={styles.titleAndButton}>
          <h1>来場者詳細情報</h1>
        </div>
        <div className={styles.inputArea}>
          {visitorDetail ? (
            <div className={styles.visitorText}>
              <div className={styles.dataArea}>
                <div>
                  <span>氏名</span>
                  <p>{visitorDetail.visitor.name || '情報がありません'}</p>
                </div>
                <div>
                  <span>所属</span>
                  <p>{visitorDetail.visitor.affiliation || '情報がありません'}</p>
                </div>
              </div>
              <div className={styles.dataArea}>
                <div>
                  <span>メールアドレス</span>
                  <p>{visitorDetail.visitor.email || '情報がありません'}</p>
                </div>
                <div>
                  <span>法人番号</span>
                  <p>{visitorDetail.visitor.employment_target_id || '詳細情報がありません'}</p>
                </div>
              </div>
            </div>
          ) : (
            <ReactLoading type='spokes' color='#37ab9d'/>
          )}
          <div className={styles.visitorEvaluation}>
            <h2>評価一覧</h2>
            <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'scroll' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>チーム名</TableCell>
                    <TableCell>デザイン</TableCell>
                    <TableCell>企画</TableCell>
                    <TableCell>技術</TableCell>
                    <TableCell>プレゼン</TableCell>
                    <TableCell>合計</TableCell>
                    <TableCell>良い点</TableCell>
                    <TableCell>悪い点</TableCell>
                    <TableCell>その他</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ratingsData.length > 0 ? (
                    ratingsData.map((rating, index) => {
                      const total = rating.design + rating.plan + rating.skill + rating.present;
                      return (
                        <TableRow key={index}>
                          <TableCell>{rating.teamName}</TableCell>
                          <TableCell>{rating.design}</TableCell>
                          <TableCell>{rating.plan}</TableCell>
                          <TableCell>{rating.skill}</TableCell>
                          <TableCell>{rating.present}</TableCell>
                          <TableCell>{total}</TableCell> {/* 合計を表示 */}
                          <TableCell>{rating.positive}</TableCell>
                          <TableCell>{rating.negative}</TableCell>
                          <TableCell>{rating.other}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9}>評価がありません</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisitorDetail;
