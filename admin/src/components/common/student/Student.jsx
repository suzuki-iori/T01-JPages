import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getCurrentFiscalYear, getFiscalYearFromDate, extractFiscalYears, filterByFiscalYear } from '../../../hooks/useFiscalYear';
import { Link } from "react-router-dom";
import Ajax from '../../../hooks/Ajax';
import { useAuth } from '../../../context/AuthContext';
import StudentAddModal from '../../base/modal/studentaddmodal/StudentAddModal';
import StudentCSVAddModal from '../../base/modal/studentCSVAddModal/StudentCSVAddModal';
import styles from './Student.module.css';

export default function Student() {
  const token = useAuth();
  const [studentData, setStudentData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  // 年度フィルター
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(getCurrentFiscalYear());

  const ShowModal = () => {
    setLoading(true);
    Ajax(null, token.token, 'team', 'get')
      .then((data) => {
        if (data.status === "success") {
          setTeamData(data.team);
        }
        setShowModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const ShowCSVModal = () => {
    setLoading(true);
    Ajax(null, token.token, 'team', 'get')
      .then((data) => {
        if (data.status === "success") {
          setTeamData(data.team);
        }
        setShowCSVModal(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    Ajax(null, token.token, 'student', 'get')
      .then((data) => {
        if (data.status === "success") {
          setStudentData(data.student);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);




  // 年度リスト抽出
  const fiscalYearList = React.useMemo(() => {
    return extractFiscalYears(studentData);
  }, [studentData]);

  // 年度・検索・学年・チームフィルタ
  const filteredStudents = studentData
    ? filterByFiscalYear(studentData, selectedFiscalYear).filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.number.toString().includes(searchTerm);
        const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
        const matchesTeam = selectedTeam ? student.teamNum === selectedTeam : true;
        return matchesSearch && matchesGrade && matchesTeam;
      })
    : [];

  // ソート機能
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue < bValue) {
      return sortDirection === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    const direction = (sortKey === key && sortDirection === 'ascending') ? 'descending' : 'ascending';
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedTeam('');
    setSelectedFiscalYear(getCurrentFiscalYear());
  };

  return (
    <>
      <div className={styles.listArea}>
        <div className={styles.pageTitle}>
          <h2>学生一覧</h2>
          <span>※表頭をクリックで昇順・降順を変更できます</span>
        </div>
        <div className={styles.processingArea}>
          <div className={styles.innerProcessing}>
            {/* 年度セレクト追加 */}
            <FormControl variant="outlined" size="small" style={{ marginLeft: '20px', width: '110px', height: 40, display: 'flex', justifyContent: 'center' }}>
              <InputLabel>年度</InputLabel>
              <Select
                value={selectedFiscalYear}
                onChange={e => setSelectedFiscalYear(e.target.value)}
                label="年度フィルター"
              >
                <MenuItem value={''}>全て</MenuItem>
                {fiscalYearList.map(year => (
                  <MenuItem key={year} value={year}>{year}年度</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              size="small"
              placeholder="検索"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ minWidth: 160, marginLeft: '20px', marginRight: 16, height: 40, display: 'flex', alignItems: 'center' }}
              inputProps={{ style: { height: 40, padding: '0 14px' } }}
            />
            <FormControl variant="outlined" size="small" style={{ marginLeft: '20px', width: '100px', height: 40, display: 'flex', justifyContent: 'center' }}>
              <InputLabel>学年</InputLabel>
              <Select
                value={selectedGrade}
                onChange={handleGradeChange}
                label="学年フィルター"
              >
                <MenuItem value="">全て</MenuItem>
                {Array.from(new Set(studentData.map(student => student.grade))).map(grade => (
                  <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" style={{ marginLeft: '20px', width: '100px', height: 40, display: 'flex', justifyContent: 'center' }}>
              <InputLabel>チーム</InputLabel>
              <Select
                value={selectedTeam}
                onChange={handleTeamChange}
                label="チームフィルター"
              >
                <MenuItem value="">全て</MenuItem>
                {Array.from(new Set(studentData.map(student => student.teamNum)))
                  .sort((a, b) => a - b) // 数値としてソート
                  .map(team => (
                    <MenuItem key={team} value={team}>{team}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button variant="outlined" color="secondary" size="small" onClick={resetFilters} style={{ marginLeft: '20px', height: 40, alignSelf: 'center' }}>
              元に戻す
            </Button>
          </div>
          <div className={styles.buttonArea}>
            <Button variant="contained" color="primary" onClick={ShowModal} style={{ marginRight: '10px' }}>
              + 学生登録
            </Button>
            <Button variant="outlined" color="primary" className={styles.csvButton} onClick={ShowCSVModal}>
              + CSV学生登録
            </Button>
          </div>
        </div>

        {showModal && (
          <StudentAddModal
            showFlag={showModal}
            setShowModal={setShowModal}
            selectData={teamData}
          />
        )}

        {showCSVModal && (
          <StudentCSVAddModal
            showFlag={showCSVModal}
            setShowCSVModal={setShowCSVModal}
            selectData={teamData}
          />
        )}

        <div className={styles.studentListArea}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    ID {sortKey === 'id' && (sortDirection === 'ascending' ? '(asc)' : '(desc)')}
                  </TableCell>
                  <TableCell onClick={() => handleSort('grade')} style={{ cursor: 'pointer' }}>
                    学年 {sortKey === 'grade' && (sortDirection === 'ascending' ? '(asc)' : '(desc)')}
                  </TableCell>
                  <TableCell onClick={() => handleSort('team_id')} style={{ cursor: 'pointer' }}>
                    チーム名 {sortKey === 'team_id' && (sortDirection === 'ascending' ? '(asc)' : '(desc)')}
                  </TableCell>
                  <TableCell>氏名</TableCell>
                  <TableCell>学籍番号</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                      <CircularProgress />
                      <p>ロード中...</p>
                    </TableCell>
                  </TableRow>
                ) : sortedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                      <p>該当するデータは見つかりませんでした。</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedStudents.map((item) => (
                    <TableRow key={item.id} component={Link} to={`/admin/student/${item.id}`}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.grade}</TableCell>
                      <TableCell>{item.teamNum}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.number}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

