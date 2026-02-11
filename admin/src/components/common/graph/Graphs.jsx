import React, { useState, useEffect, useMemo } from "react";
import styles from "./graphs.module.css";
import { VisitorPie } from "./graphs/VisitorPie";
import VisitorCounter from "./graphs/VisitorCounter";
import TeanRanking from "./graphs/TeanRanking";
import TestModel from "./graphs/TestModel";
import GraphFilterModal from '../../base/modal/graphFilterModal/graphFilterModal';

import { useAuth } from '../../../context/AuthContext';
import Ajax from "../../../hooks/Ajax";

export const Graphs = () => {
  const token = useAuth();
  
  const [visitorData, setVisitorData] = useState({ visitor: [] });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDivisions, setSelectedDivisions] = useState([1, 2, 3, 4, 5]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartType, setChartType] = useState('bar'); 

  const yearOptions = [2023, 2024, 2025, 2026];
  const divisionOptions = [
    { id: 1, name: '企業' },
    { id: 2, name: '教員' },
    { id: 3, name: 'JEC生徒' },
    { id: 4, name: 'OB・OG' },
    { id: 5, name: 'その他' },
  ];

  const fetchVisitorData = () => {
    if (!token?.token) return;
    
    Ajax(null, token.token, 'visitor', 'get')
      .then((data) => {
        if (data.status === "success") {
          setVisitorData(data);
        }
      });
  };

  useEffect(() => {
    fetchVisitorData();
  }, [token.token]); 

  const filteredVisitors = useMemo(() => {
    return (visitorData.visitor || []).filter(v => {
      const year = new Date(v.created_at).getFullYear();
      const isYearMatch = year === selectedYear;
      const isDivisionMatch = selectedDivisions.includes(Number(v.division));
      return isYearMatch && isDivisionMatch;
    });
  }, [visitorData, selectedYear, selectedDivisions]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleDivisionChange = (e) => {
    const division = parseInt(e.target.value);
    setSelectedDivisions(prev => 
      prev.includes(division) ? prev.filter(d => d !== division) : [...prev, division]
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.controlPanel}>
        <button onClick={() => setIsModalOpen(true)} className={styles.filterButton}>
          {selectedYear}年度 絞り込み設定
        </button>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.graphTop}>
          <VisitorPie data={{ visitor: filteredVisitors }} />
          <VisitorCounter 
            count={filteredVisitors.length} 
            selectedYear={selectedYear}
          />
          <TeanRanking selectedYear={selectedYear} />
        </div>
        
        <TestModel 
          data={visitorData} 
          selectedYear={selectedYear} 
          selectedDivisions={selectedDivisions} 
          chartType={chartType}
        />
      </div>

      <GraphFilterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        yearOptions={yearOptions}
        divisionOptions={divisionOptions}
        selectedYears={[selectedYear]} 
        selectedDivisions={selectedDivisions}
        handleYearChange={handleYearChange}
        handleDivisionChange={handleDivisionChange}
        chartType={chartType}
        setChartType={setChartType}
      />
    </div>
  );
};