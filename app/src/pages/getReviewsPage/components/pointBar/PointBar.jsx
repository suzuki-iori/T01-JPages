import React from 'react';
import styles from './PointBar.module.scss';
import Progress from '../../../../components-old/atoms/progress/Progress';
function PointBar(props) {
	const {name, value} = props;
	let berColor = '';
	if(name === 'plan') {
		berColor = '#facccc';
	} else if(name === 'design') {
		berColor = '#e7c9f1';
	} else if(name === 'skill') {
		berColor = '#c6d8ff';
	} else {
		berColor = '#C6F8F8';
	}
	return (
		<>
			<p className={styles.name}>{name}</p>
			<div className={styles.pointBarWrap}>
			<Progress value={value} barColor={berColor} backGroundColor={'rgb(247, 242, 223)'} borderColor={'#876344'}/>
				<p className={styles.point}>{value}</p>
			</div>
		</>
	);
}

export default PointBar;