import React from 'react';
import styles from './GetComment.module.scss';

function GetComment(props) {
	const {name, value} = props;
	const JpName = {
		positive : '良い点',
		negative : '改善点',
		other : 'その他',
	}
	return (
		<div className={styles.getCommentField}>
			<div className={styles.icon}>
				<figure className={styles.category}><img src={`/assets/img/${name}.svg`} alt={name} /></figure>
				<figcaption>{JpName[name]}</figcaption>
			</div>
			<p className={styles.commentBox}>{value}</p>
		</div>
			
	);
}

export default GetComment;