import React from 'react'
import Ajax from '../../../../hooks/Ajax';
import { useAuth } from '../../../../context/AuthContext';
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './graphs.module.css'
import { faPersonShelter } from '@fortawesome/free-solid-svg-icons';


const VisitorCounter = () => {
    const token = useAuth();
    const [visitorData, setVisitorData] = useState([]);
    const [isCounting, setIsCounting] = useState(false);

    const fetchCount = () => {
        Ajax(null, token.token, 'visitor', 'get')
          .then((data) => {
            if (data.status === "success") {
                setVisitorData(data.visitor.length); 
                startCountAnimation(data.visitor.length);
                console.log(data.visitor.length);
                
            } else {
              console.log(data.status);
            }
          });
      };

      const startCountAnimation = (targetCount) => {
        setIsCounting(true);
        let currentCount = 0;
        const duration = 1000; // 2秒でカウントアップ
        const stepTime = duration / targetCount;

        const interval = setInterval(() => {
            currentCount += 1;
            setVisitorData(currentCount);
            if (currentCount >= targetCount) {
                clearInterval(interval);
                setIsCounting(false);
            }
        }, stepTime);
    };
    useEffect(() => {
        fetchCount();
        const intervalId = setInterval(fetchCount, 100000);
        return () => clearInterval(intervalId); // クリーンアップ
    }, []);

  return (
    <div className={styles.VisitorCounter}>
        <FontAwesomeIcon icon={faPersonShelter} style={{width:"100px",height:"100px", color:"#37ab9d"}}/>
        <span>累計来場者数</span>
        <p>{visitorData}</p>
    </div>
  )
}

export default VisitorCounter
