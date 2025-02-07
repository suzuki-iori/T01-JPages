import React from 'react';
import styles from './InputRange.module.scss';

function InputRange(props) {
	const {category, data, seter, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchEnd } = props;
	const barColor = {
		plan : '#facccc',
		design : '#e7c9f1',
		skill : '#c6d8ff',
		present : '#C6F8F8',
	}
	return(
		<input
			className={styles.inputRange} id={category}
			type="range" min="0" max="100" step="10"
			name={category}
			value={data}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onChange={(e) => seter(e.target.value)}
			style={{ background: `linear-gradient(90deg, ${barColor[category]} ${data}%, #F2ECD4 ${data}%)` }}
		/>

	) 
}

export default InputRange;