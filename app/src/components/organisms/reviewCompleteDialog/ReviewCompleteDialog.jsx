import React, { useContext, useEffect, useState } from 'react';
import styles from './ReviewCompleteDialog.module.scss';
import { AppContext } from '../../AppContextProvider.jsx';
function ReviewCompleteDialog(props) {
	const {status} = props;
	const [message, setMessage] = useState(status ? '評価ありがとうございます！' : 'すでに投票されています');

	// context
	const  {
		setAppState
	} = useContext(AppContext);
	
	// メッセージの変更
	useEffect(() => {
		setMessage(status ? '評価ありがとうございます！' : '同じチームに投票はできません');
	}, [status])

	// リダイレクト処理
	const redirect = () => {
		if(status) {
			setAppState('getReview');
		}
		else {
			setAppState('home');
		}
	}

	return (
	<div className={styles.dialogBg}>
		<div className={styles.dialog}>
			<p>{message}</p>
			{status && <figure><img src="https://placehold.jp/150x150.png" alt="投稿完了"/></figure>}
			<button type="button" className={styles.btnClose} onClick={() => redirect()}>閉じる</button>
		</div>
	</div>
	);
}

export default ReviewCompleteDialog;