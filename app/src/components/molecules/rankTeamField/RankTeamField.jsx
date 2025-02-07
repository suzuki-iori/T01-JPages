import React, { useEffect, useState } from 'react';
import styles from './RankTeamField.module.scss';

function RankTeamField(props) {
	const {rankingData, activeItem} = props;
	// data
	const [year, setYear] = useState(0);
	// 日付の計算
	useEffect(() => {
		const dataDate = new Date(rankingData.created_at);
		let dataYear = dataDate.getFullYear();
		if(dataDate.getMonth() + 1 >= 4) {
			dataYear++;
		}
		setYear(dataYear);
	},[rankingData])
	return (
		<div className={styles.rankTeamField}>
			<span className={styles.teamNum}>{rankingData.num}</span>
			<figure className={styles.teamIcon}>
				<img 
					src={`/assets/img/logo/${year}/${rankingData.num}.png`} alt={`${rankingData.num}logo`} 
					onError={(e) => e.target.src = 'https://placehold.jp/dddddd/555555/150x150.png?text=logo'}
				/>
			</figure>
			<div className={styles.teamText}>
				<div className={styles.teamName}>
					<p className={styles.teamName_item}>{rankingData.name}</p>
					<p className={styles.teamName_item}>{rankingData.name}</p>
					<p className={styles.teamName_item}>{rankingData.name}</p>
					<p className={styles.teamName_item}>{rankingData.name}</p>
				</div>
				<p className={styles.count}><img src={`/assets/img/people.svg`} alt="" className={styles.countImg}/><span className={styles.num}>{rankingData.count}</span>人{/*が訪れました。*/}</p>
			</div>
			<div className={styles.point}>
				<p className={styles.pointIcon}>P</p>
				<p>{rankingData[activeItem]}</p>
			</div>
		</div>
	);
}

export default RankTeamField;
		