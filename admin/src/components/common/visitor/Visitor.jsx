import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TextField, TableHead, TableRow, Paper, CircularProgress, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Link } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import Ajax from '../../../hooks/Ajax';
import styles from './Visitor.module.css';

const divisionOptions = [
  { id: 1, label: '企業' },
  { id: 2, label: '教員' },
  { id: 3, label: '学生' },
  { id: 4, label: 'OB・OG' },
  { id: 5, label: 'その他' }
];

const Visitor = () => {
  const token = useAuth();
  const [visitorData, setVisitorData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('');

  const fetchVisitorData = () => {
    setLoading(true);
    Ajax(null, token.token, 'visitor', 'get')
      .then((data) => {
        if (data.status === "success") {
          setVisitorData(data.visitor);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVisitorData();
    const intervalId = setInterval(fetchVisitorData, 60000);
    return () => clearInterval(intervalId);
  }, [token]);

  const filteredVisitors = visitorData.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          visitor.affiliation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = selectedDivision ? visitor.division === selectedDivision : true;

    return matchesSearch && matchesDivision;
  });

  const downloadCSV = () => {
    const csvRows = [
      ['ID', '名前', '所属', 'メールアドレス'], // ヘッダー行
      ...filteredVisitors.map(visitor => [
        visitor.id,
        visitor.name,
        visitor.affiliation,
        visitor.email
      ])
    ];

    // CSV文字列を生成
    const csvString = csvRows.map(row => row.join(',')).join('\n');

    // UTF-8 BOMを追加
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'visitors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.visitorTable}>
      <div className={styles.pageTitle}>
        <h2>来場者一覧</h2>
      </div>
      <div className={styles.sortArea}>
        <div style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            placeholder="検索"
            className={styles.searchArea}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: '20px' }}
          />
          <FormControl variant="outlined" className={styles.divisionSelect}>
            <InputLabel>部門</InputLabel>
            <Select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              label="部門"
            >
              <MenuItem value="">
                <em>すべて</em>
              </MenuItem>
              {divisionOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button variant="outlined" color="primary" onClick={downloadCSV}>
          CSVダウンロード
        </Button>
      </div>
      <div className={styles.listArea}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
            <p>ロード中...</p>
          </div>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: '100%', maxWidth: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>名前</TableCell>
                  <TableCell>所属</TableCell>
                  <TableCell>メールアドレス</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVisitors.map((row) => (
                  <TableRow key={row.id} component={Link} to={`/admin/visitor/${row.id}`}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.affiliation}</TableCell>
                    <TableCell>{row.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Visitor;
