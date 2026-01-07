import React from 'react';
import styles from './RankTop3.module.scss';
import RankTopIcon from '../../molecules/rankTopIcon/RankTopIcon';

function RankTop3(props) {
	const {topRankingData, handleClick} = props;

	return (
		<ol className={styles.rankTop3}>
			{topRankingData.map((data, index) => {
				return(
					<li key={'ranking-' + data.id} className={styles[`rank${index + 1}`]} onClick={() => handleClick(data.id, data.num)}>
						{(index === 0) && (
							<figure className={styles.kingIcon}>
								<img src={`/assets/img/no1.svg`} alt="rank1"/>
							</figure>
						)}
						<RankTopIcon teamNum={data.num} date={data.created_at}/>
						<div className={styles.rankGraph}>{index + 1}</div>
					</li>
				)
			})}
		</ol>
	);
}

export default RankTop3;