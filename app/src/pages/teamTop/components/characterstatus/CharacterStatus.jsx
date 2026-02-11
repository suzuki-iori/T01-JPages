import React, { useState, useEffect } from "react";
import styles from "./characterStatus.module.css"

const CharacterStatus = ({ level, point, count }) => {
	// data
	const [progress, setProgress] = useState(0);

	// レベル境界値（バックエンドと同じ）
	const levelBorder = [10000, 6500, 4000, 2000, 600];

	// ポイントバーの長さを決める
	useEffect(() => {
		const calculateProgress = (point) => { // returnはprogressのwidth
			if (point >= levelBorder[0]) {
				return 100;
			}
			else if (point >= levelBorder[1]) {
				return ((point - levelBorder[1]) / (levelBorder[0] - levelBorder[1])) * 100;
			}
			else if (point >= levelBorder[2]) {
				return ((point - levelBorder[2]) / (levelBorder[1] - levelBorder[2])) * 100;
			}
			else if (point >= levelBorder[3]) {
				return ((point - levelBorder[3]) / (levelBorder[2] - levelBorder[3])) * 100;
			}
			else if (point >= levelBorder[4]) {
				return ((point - levelBorder[4]) / (levelBorder[3] - levelBorder[4])) * 100;
			}
			return (point / levelBorder[4]) * 100;
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

export default CharacterStatus;
