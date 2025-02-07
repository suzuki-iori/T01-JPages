import React from 'react'
import Ajax from '../../../../hooks/Ajax'
import { useState } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './graphs.module.css'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

const TeanRanking = () => {
    const token = useAuth();
    // const [score,setScore] = useState();
    const [ratingItem, setRatingItem] = useState([]); // 修正: 初期化を空の配列に

    useEffect(() => {
        Ajax(null, null, 'ranking', 'get')
            .then((data) => {
                if (data) {
                    // console.log(data);
                    // console.log("dekite");
                    const sortedData = data.sort((a, b) => b.total - a.total);
                    setRatingItem(sortedData);
                    // console.log(sortedData);
                } else {
                    console.log(data.status);
                    console.log(data.message);
                }
            });
    }, []);

    return (
        <>
            <div className={styles.rankingArea}>
                {ratingItem.map((item, index) => (
                    <div key={item.id}className={styles.ranking}>
                        <span>
                            {index === 0 ? <FontAwesomeIcon icon={faCrown}size='lg' /> : `${index + 1}位 `}
                        </span>
                        <p className={styles.rankingName}>{item.name}</p>
                        <p className={styles.rankingScore}> {item.total}pt</p>
                    </div>
                ))}
            </div>
        </>
    );
    }


export default TeanRanking