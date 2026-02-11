import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import styles from './Team.module.css';
import TeamButton from '../../base/teambutton/TeamButton';
import { useAuth } from '../../../context/AuthContext';
import Ajax from '../../../hooks/Ajax';
import { getCurrentFiscalYear, getFiscalYearFromDate, extractFiscalYears, filterByFiscalYear } from '../../../hooks/useFiscalYear';
import AddTeamModal from '../../base/modal/addteamModal/AddTeamModal';

// 定数
const VIEW_TYPES = { CARD: 'card', LIST: 'list' };
const SORT_OPTIONS = [
  { value: 'asc', label: '昇順' },
  { value: 'desc', label: '降順' },
];

// 年度計算はutilに移動

// チームアイテムコンポーネント
const TeamItem = ({ team, isCardView }) => {
  const year = getFiscalYearFromDate(team.created_at);
  const imagePath = `/assets/img/logo/${year}/${team.num}.png`;

  const itemClass = isCardView ? styles.cardItem : styles.listItem;
  const linkClass = isCardView ? styles.cardLink : styles.listLink;
  const imgAreaClass = isCardView ? styles.teamImgCardArea : styles.teamImgListArea;

  if (isCardView) {
    return (
      <div className={itemClass}>
        <Link to={`/admin/team/${team.id}`} className={linkClass}>
          <p className={styles.teamId}>ID: {team.id}</p>
          <p>{team.num}</p>
          <h2>{team.name || '未設定'}</h2>
          <div className={imgAreaClass}>
            <img
              src={imagePath}
              alt="ロゴ"
              onError={(e) => e.target.src = 'https://placehold.jp/dddddd/555555/250x150.png?text=NoImage'}
            />
          </div>
        </Link>
      </div>
    );
  }

  // リスト表示
  return (
    <div className={itemClass}>
      <Link to={`/admin/team/${team.id}`} className={linkClass}>
        <div className={styles.listCol}>
          <span className={styles.listLabel}>ID</span>
          <span>{team.id}</span>
        </div>
        <div className={styles.listCol}>
          <span className={styles.listLabel}>No.</span>
          <span>{team.num}</span>
        </div>
        <div className={styles.listColName}>
          <span className={styles.listLabel}>チーム名</span>
          <span>{team.name || '未設定'}</span>
        </div>
        <div className={imgAreaClass}>
          <img
            src={imagePath}
            alt="ロゴ"
            onError={(e) => e.target.src = 'https://placehold.jp/dddddd/555555/100x100.png?text=NoImage'}
          />
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
  // 年度フィルター
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(getCurrentFiscalYear());

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

  // 年度リスト抽出
  const fiscalYearList = React.useMemo(() => {
    return extractFiscalYears(teams);
  }, [teams]);

  // 年度・検索フィルタ
  const filteredTeams = teams
    ? filterByFiscalYear(teams, selectedFiscalYear).filter((t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // ソート処理
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
          {/* 年度セレクト追加 */}
          <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 16, height: 40, display: 'flex', justifyContent: 'center' }} size="small">
            <InputLabel>年度</InputLabel>
            <Select
              value={selectedFiscalYear}
              onChange={e => setSelectedFiscalYear(e.target.value)}
              label="年度"
            >
              <MenuItem value={''}>すべて</MenuItem>
              {fiscalYearList.map(year => (
                <MenuItem key={year} value={year}>{year}年度</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ minWidth: 100, marginRight: 16, height: 40, display: 'flex', justifyContent: 'center' }} size="small">
            <InputLabel>並び順</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="並び順"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            size="small"
            placeholder="検索"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ minWidth: 160, marginRight: 16, height: 40, display: 'flex', alignItems: 'center' }}
            inputProps={{ style: { height: 40, padding: '0 14px' } }}
          />

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
