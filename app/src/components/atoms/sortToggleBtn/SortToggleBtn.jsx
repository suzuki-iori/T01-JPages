import React, { useState, useEffect } from 'react';
import styles from './SortToggleBtn.module.scss';

function SortToggleBtn(props) {
	const {pointSortData, pointSortDataChange} = props;

	// data
	const name = pointSortData.name;
	const status = pointSortData.status;
	const [pointStatus, setPointStatus] = useState('');
	const [pointSortActive, setPointSortActive] = useState(false);

	useEffect(() => {
		// 次のインデックスを計算（3つを循環）
		if(status === 'asc') {
			setPointStatus('↑');
			setPointSortActive(true);
		} else if(status === 'desc') {
			setPointStatus('↓');
			setPointSortActive(true);
		} else {
			setPointStatus(' ');
			setPointSortActive(false);
		}
	},[status]);

	return (
		<button
			className={`${styles.sortToggleBtn} ${pointSortActive && styles.active}`}
			type="button"
			onClick={() => pointSortDataChange(name)}
		>{name} {pointStatus}</button>
	);
}

export default SortToggleBtn;
