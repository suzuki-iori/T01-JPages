import React, { useContext } from 'react';
import styles from './GetOneReview.module.scss';
import PointBar from '../../atoms/pointBar/PointBar';
import GetComment from '../../atoms/getComment/GetComment';
import {AppContext} from '../../../context/AppContextProvider';
function GetOneReview(props) {
	const {getReviewOneData, divisionName} = props;
	const {
		loginType
	} = useContext(AppContext);

	let visitorName = '';
	if(getReviewOneData.visitor) {
		if(divisionName === '教員') { //「教員」は先生の名前(visitor.name)を表示
			visitorName = getReviewOneData.visitor.name;
		} else {
			visitorName = getReviewOneData.visitor.affiliation;
		}
	}

	return (
		<div className={styles.oneReview}>
			<div className={styles.division}>{divisionName}</div>
			{loginType === 'student' && <p className={styles.visitorName}>{visitorName}</p>}
			<ul className={styles.pointBarField}>
				{Object.keys(getReviewOneData.point).map((data, index) => {
					let pointbar = '';
					if(data !== 'total') {
						pointbar = (<li key={getReviewOneData.id + data}><PointBar name={data} value={getReviewOneData.point[data]}/></li>)
					}
					return pointbar
				})}
			</ul>
			<ul className={styles.commentField}>
				{Object.keys(getReviewOneData.comment).map((data, index) => {
					return(<li key={getReviewOneData.id + data}><GetComment name={data} value={getReviewOneData.comment[data]}/></li>)
				})}
			</ul>  
		</div>
	);
}

export default GetOneReview;