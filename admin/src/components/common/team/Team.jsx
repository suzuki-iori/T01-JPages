import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import styles from './Team.module.css';
import TeamButton from '../../base/teambutton/TeamButton';
import { useAuth } from '../../../context/AuthContext';
import Ajax from '../../../hooks/Ajax';
import AddTeamModal from '../../base/modal/addteamModal/AddTeamModal';

// 定数
const VIEW_TYPES = { CARD: 'card', LIST: 'list' };
const SORT_OPTIONS = [
  { value: 'asc', label: '昇順' },
  { value: 'desc', label: '降順' },
];

// 年度計算ユーティリティ
const calculateFiscalYear = (createdAt) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  return date.getMonth() + 1 >= 4 ? year + 1 : year;
};

// チームアイテムコンポーネント
const TeamItem = ({ team, isCardView }) => {
  const year = calculateFiscalYear(team.created_at);
  const imagePath = `/assets/img/logo/${year}/${team.num}.png`;

  const itemClass = isCardView ? styles.cardItem : styles.listItem;
  const linkClass = isCardView ? '' : styles.listLink;
  const innerClass = isCardView ? '' : styles.innerList;
  const imgAreaClass = isCardView ? styles.teamImgCardArea : styles.teamImgListArea;

  return (
    <div className={itemClass}>
      <Link to={`/admin/team/${team.id}`} className={linkClass}>
        <div className={innerClass}>
          <p>{team.num}</p>
        </div>
        <div className={imgAreaClass}>
          <img src={imagePath} alt="ロゴ" />
        </div>
        <div className={innerClass}>
          <h2>{team.name || '未設定'}</h2>
        </div>
      </Link>
    </div>
  );
};

export const Team = () => {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [isCardView, setIsCardView] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamData = useCallback(() => {
    Ajax(null, token, 'team', 'get')
      .then((data) => {
        if (data.status === 'success') {
          setTeams(data.team || []);
        }
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchTeamData();
    const intervalId = setInterval(fetchTeamData, 5000);
    return () => clearInterval(intervalId);
  }, [token, fetchTeamData]);

  // フィルタ処理
  const filteredTeams = teams.filter((t) =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ソート処理（バグ修正: numA.localeCompare(numA) → numA.localeCompare(numB)）
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    const numA = a.num || '';
    const numB = b.num || '';
    return sortOrder === 'asc' ? numA.localeCompare(numB) : numB.localeCompare(numA);
  });

  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleSearchChange = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleSortChange = useCallback((e) => setSortOrder(e.target.value), []);

  const renderTeamList = () => {
    if (isLoading) {
      return (
        <article className={styles.loadingArea}>
          <CircularProgress />
          <p>ロード中</p>
        </article>
      );
    }

    if (sortedTeams.length === 0) {
      return (
        <div className={styles.noDataMessage}>
          キーワードに関連するデータは見つかりませんでした。
        </div>
      );
    }

    return sortedTeams.map((team) => (
      <TeamItem key={team.id} team={team} isCardView={isCardView} />
    ));
  };

  return (
    <div className={styles.teamArea}>
      <AddTeamModal showFlag={showModal} setShowModal={setShowModal} teamData={teams} />

      <div className={styles.teamTopArea}>
        <div className={styles.pageTitle}>
          <h2>チーム一覧</h2>
        </div>

        <div className={styles.visualSet}>
          <label className={styles.sortBox}>
            <select value={sortOrder} onChange={handleSortChange}>
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className={styles.searchArea}>
            <input
              type="search"
              placeholder="チーム名で検索"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>

          <div className={styles.visualButtonArea}>
            <TeamButton visualType={VIEW_TYPES.CARD} onClick={() => setIsCardView(true)} isActive={isCardView} />
            <TeamButton visualType={VIEW_TYPES.LIST} onClick={() => setIsCardView(false)} isActive={!isCardView} />
          </div>

          <Button variant="contained" className={styles.addTeamButton} onClick={handleOpenModal}>
            + チーム追加
          </Button>
        </div>
      </div>

      <div className={isCardView ? styles.teamCardArea : styles.teamAreaList}>
        {renderTeamList()}
      </div>
    </div>
  );
};
