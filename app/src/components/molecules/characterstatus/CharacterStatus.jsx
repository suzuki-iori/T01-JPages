import React, { useState, useEffect } from "react";
import styles from "./characterStatus.module.css";
import Progress from "../../atoms/progress/Progress";

const LevelAndPoints = (props) => {
	// data
	const {character, count} = props;
	const [progress, setProgress] = useState(0);

	// ポイントバーの長さを決める
	useEffect(() => {
		const calculateProgress = (point) => { // returnはprogressのwidth
			if (point >= 18000) {
				return 100;
			}
			else if (point >= 11000) {
				return ((point - 11000) / 7000) * 100;
			}
			else if (point >= 7000) {
				return ((point - 7000) / 4000) * 100;
			}
			else if (point >= 3500) {
				return ((point - 3500) / 3500) * 100;
			}
			else if (point >= 1000) {
				return ((point - 1000) / 2500) * 100;
			}
			return (point / 1000) * 100;
		};
		setProgress(calculateProgress(character.point))
	}, [character]);

	return (
		<div className={styles.container}>
			<div className={styles.level}>
				<span className={styles.levelText}>Lv.</span>
				<span className={styles.levelNumber}><span>{character.level}</span></span>
				<Progress value={progress} barColor={'rgb(135, 99, 68)'} backGroundColor={'rgba(255,255,255,0.5)'}/>
			</div>
			<div className={styles.points}>
				<p className={styles.pointContainer}>
					<img src='/assets/img/point.png' className={styles.png} alt="ポイント"/>
					{character.point ? character.point.toLocaleString() : 0} <span>/ {character.nextLevelBorder ? character.nextLevelBorder.toLocaleString() : 0}</span> 
				</p>
				<div className={styles.countContainer}>
					<img src={`/assets/img/people.svg`} alt="" className={styles.countImg}/>
					<p>{count}</p>
				</div>
			</div>
		</div>
	);
};

export default LevelAndPoints;
