import React, { useState, useEffect, useMemo } from 'react';
import Ajax from '../../../../hooks/Ajax';
import { useAuth } from '../../../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import styles from './graphs.module.css';

const TeanRanking = ({ selectedYear }) => {
    const token = useAuth();
    const [allRankingData, setAllRankingData] = useState([]); 

    useEffect(() => {
        Ajax(null, null, 'ranking', 'get')
            .then((data) => {
                if (data) {
                    setAllRankingData(data);
                }
            });
    }, []);

    const filteredRanking = useMemo(() => {
        return allRankingData
            .filter(item => {
                const itemYear = new Date(item.created_at).getFullYear();
                return itemYear === selectedYear;
            })
            .sort((a, b) => b.total - a.total); 
            
    }, [allRankingData, selectedYear]);

    return (
        <div className={styles.rankingArea}>
            <div className={styles.rankingHeader}>
                <span style={{ flex: '0 0 50px' }}>順位</span>
                <span style={{ flex: '1', textAlign: 'left', paddingLeft: '10px' }}>チーム名</span>
                <span style={{ flex: '0 0 80px' }}>スコア</span>
            </div>

            <div className={styles.rankingScroll}>
                {filteredRanking.length > 0 ? (
                    filteredRanking.map((item, index) => (
                        <div key={item.id} className={styles.ranking}>
                            <div className={`${styles.rankValue} ${
                                index === 0 ? styles.gold : 
                                index === 1 ? styles.silver : 
                                index === 2 ? styles.bronze : ""
                            }`}>
                                {index < 3 ? (
                                    <FontAwesomeIcon icon={faCrown} size={index === 0 ? 'lg' : 'sm'} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <p className={styles.rankingName}>{item.name}</p>
                            <p className={styles.rankingScore}>{item.total.toLocaleString()}pt</p>
                        </div>
                    ))
                ) : (
                    <div className={styles.noDataInList}>データがありません</div>
                )}
            </div>
        </div>
    );
}

export default TeanRanking;