import React, { useState, useEffect } from "react";
import styles from "./characterStatus.module.css"

const LevelAndPoints = ({ level, point, count }) => {
	// data
	const [progress, setProgress] = useState(0);

	// ポイントバーの長さを決める
	useEffect(() => {
		const calculateProgress = (point) => { // returnはprogressのwidth
			if (point >= 10000 ) {
				return 100;
			}
			else if (point >= 6500 ) {
				return ((point - 6500 ) / 3500) * 100; 
			}
			else if (point >= 4000 ) {
				return ((point - 3800 ) / 2500) * 100; 
			}
			else if (point >= 2000 ) {
				return ((point - 2000 ) / 2000) * 100; 
			}
			else if (point >= 600 ) {
				return ((point - 600 ) / 1400) * 100; 
			}
			return (point / 600 ) * 100;
		};
		setProgress(calculateProgress(point))
	}, [point]);




	return (
		<div className={styles.container}>
			<div className={styles.level}>
				<span className={styles.levelText}>Lv.</span>
				<span className={styles.levelNumber}><span>{level}</span></span>
				<div className={styles.bar}>
						<div className={styles.progress} style={{ width: `calc(${progress}% + 4px)` }} />
				</div>
			</div>
			<div className={styles.points}>
				<p className={styles.pointContainer}><img src='/assets/img/point.png' className={styles.png}/>{point ? point.toLocaleString() : 0}</p>
				<div className={styles.countContainer}>
					<img src={`/assets/img/people.svg`} alt="" className={styles.countImg}/>
					<p>{count}</p>
				</div>
			</div>
		</div>
	);
};

export default LevelAndPoints;
