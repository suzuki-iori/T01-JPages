import React from 'react';
import styles from './Comment.module.scss';

function Comment(props) {
	const {question, category, data, seter} = props;
	return (
		<>
			<dt>
				<div className={styles.question}>
					<div>{question}</div>
				</div>
			</dt>
			<dd>
				<label htmlFor={category} className={styles.imgLabel}><img src={`/assets/img/${category}.svg`} alt={category}/></label>
				<textarea name={category} id={category} placeholder='ご回答はご自由にどうぞ' onChange={(e) => seter(e.target.value)} value={data}/>
			</dd>
		</>
	);
}

export default Comment;