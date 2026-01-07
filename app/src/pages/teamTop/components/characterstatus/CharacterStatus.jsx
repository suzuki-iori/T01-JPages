import React, { useState, useEffect } from "react";
import styles from "./characterStatus.module.css";
import Progress from "../../../../components-old/atoms/progress/Progress";

const CharacterStatus = (props) => {
	// data
	const {character, count} = props;
	const [progress, setProgress] = useState(0);

	// ポイントバーの長さを決める
	useEffect(() => {
		const calculateProgress = (point) => { // returnはprogressのwidth
		console.log(point);

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

export default CharacterStatus;
