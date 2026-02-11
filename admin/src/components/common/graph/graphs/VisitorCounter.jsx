import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonShelter } from '@fortawesome/free-solid-svg-icons';
import styles from './graphs.module.css';

const VisitorCounter = ({ count, selectedYear }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = count || 0; 
    const duration = 1000; 

    if (end === 0) {
      setDisplayCount(0);
      return;
    }

    const intervalTime = 20;
    const totalSteps = duration / intervalTime;
    const step = Math.ceil(end / totalSteps); 

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayCount(start);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className={styles.VisitorCounter}>
      <FontAwesomeIcon 
        icon={faPersonShelter} 
        style={{ width: "80px", height: "80px", color: "#37ab9d" }} 
      />
      
      <span>{selectedYear}年度 累計来場者数</span>
      
      <p>{displayCount.toLocaleString()}人</p>
    </div>
  );
};

export default VisitorCounter;