import React, { useState, useEffect } from 'react';
import styles from './GetReviewSortDialog.module.scss'
import SortToggleBtn from '../../atoms/sortToggleBtn/SortToggleBtn.jsx';
function GetReviewSortDialog(props) {
	const {
		setDialog, //ダイアログの表示
		timeSortStatus, //日時Sort
		setTimeSortStatus, //日時Sort
		pointSortData, //ポイントSort
		pointSortDataChange, //ポイントSort
		divisionNames, //来場区分
		filterDivisionValiables, //来場区分filter
		setFilterDivisionValiables, //来場区分filter
		filterCommentValiables, //コメントfilter
		setFilterCommentValiables, //コメントfilter
	} = props;

	//コメント
	const commentNames = ['positive', 'negative', 'other'];
	//コメントの選択項目
	const [isCommentChecked, setIsCommentChecked] = useState([false, false, false]);
	//コメントの「すべて選択」ボタンのactive状態
	const [commentAllBtnActive, setCommentAllBtnActive] = useState(false);
	//来場区分の選択項目
	const [isDivisionChecked, setIsDivisionChecked] = useState([false, false, false, false, false]);
	//来場区分の「すべて選択」ボタンのactive状態
	const [divisionAllBtnActive, setDivisionAllBtnActive] = useState(false);

	//ダイアログを閉じる前の選択状態にする
	useEffect(() => {
		//来場区分
		let newDivisionIsChecked = [...isDivisionChecked];
		filterDivisionValiables.forEach(e => {
			newDivisionIsChecked[e - 1] = true;
		});
		setIsDivisionChecked(newDivisionIsChecked);
		//コメント
		let newCommentIsChecked = [...isCommentChecked];
		filterCommentValiables.forEach(e => {
			newCommentIsChecked[commentNames.indexOf(e)] = true;
		});
		setIsCommentChecked(newCommentIsChecked);
	}, []);

	/**
	 * 閉じるボタン
	 */
	const closeDialog = (() => {
		//来場区分の選択項目を配列で送る
		let newFilterDivisionValiables = [];
		isDivisionChecked.forEach((e,i) => {
			if(e) {
				newFilterDivisionValiables.push(i + 1);
			}
			setFilterDivisionValiables(newFilterDivisionValiables);
		})
		//コメントの選択項目を配列で送る
		let newFilterCommentValiables = [];
		isCommentChecked.forEach((e,i) => {
			if(e) {
				newFilterCommentValiables.push(commentNames[i]);
			}
			setFilterCommentValiables(newFilterCommentValiables);
		})
		//ダイアログ閉じる
		setDialog(false);
	});

	/**
	 * コメント
	 */
	//コメントの「すべて選択」ボタンが押された時
	const AllChangeComment = () => {
		if(isCommentChecked.every(e => {
			return(e === true) 
		})) {
			setIsCommentChecked([false, false, false]);
			setCommentAllBtnActive(false);
		} else {
			setIsCommentChecked([true, true, true]);
			setCommentAllBtnActive(true);
		}
	}
	//コメントのひとつ選択、解除
	const changeComment = (e) => {
		let newCommentIsChecked = [...isCommentChecked];
		newCommentIsChecked[e] = !newCommentIsChecked[e];
		setIsCommentChecked(newCommentIsChecked);
	}
	/* コメントのひとつ選択、解除されたときに
	「すべて選択」ボタンのactive状態を変更できるようにした */
	useEffect(() => {
		if(isCommentChecked.every(e => {
			return(e === true) 
		})) {
			setCommentAllBtnActive(true);
		}else {
			setCommentAllBtnActive(false);
		}
		}, [isCommentChecked]);
	/**
	 * 来場区分
	 */
	//来場区分の「すべて選択」ボタンが押された時
	const AllChangeDivision = () => {
		if(isDivisionChecked.every(e => {
			return(e === true) 
		})) {
			setIsDivisionChecked([false, false, false, false, false]);
			setDivisionAllBtnActive(false);
		} else {
			setIsDivisionChecked([true, true, true, true, true]);
			setDivisionAllBtnActive(true);
		}
	}
	//来場区分のひとつ選択、解除
	const changeDivision = (e) => {
		let newDivisionIsChecked = [...isDivisionChecked];
		newDivisionIsChecked[e] = !newDivisionIsChecked[e];
		setIsDivisionChecked(newDivisionIsChecked);
	}
	/* 来場区分のひとつ選択、解除されたときに
	「すべて選択」ボタンのactive状態を変更できるようにした */
	useEffect(() => {
		if(isDivisionChecked.every(e => {
			return (e === true);
		})) {
			setDivisionAllBtnActive(true);
		}else {
			setDivisionAllBtnActive(false);
		}
	}, [isDivisionChecked]);

	return (
		<div className={styles.dialogBg}>
			<div className={styles.dialog}>
				<h2 className={styles.title}>並び替え</h2>
				<div className={styles.getReviewSort}>
					<div className={styles.sortList}>
						<p>日時</p>
						<ul className={`${styles.list} ${styles.getReviewSortList}`}>
							<li>
								<input
									className={`${timeSortStatus === 'desc' && styles.active}`}
									type="radio" name="getReviewSortTime" id="new"
									onChange={() => setTimeSortStatus('desc')}
								/>
								<label htmlFor="new">新着順</label>
							</li>
							<li>
								<input
									className={`${timeSortStatus === 'asc' && styles.active}`}
									type="radio" name="getReviewSortTime" id="old"
									onChange={() => setTimeSortStatus('asc')}
								/>
								<label htmlFor="old">古い順</label>
							</li>
						</ul>
					</div>
					<div className={styles.sortList}>
							<p>ポイント</p>
							<ul className={`${styles.list} ${styles.getReviewSortList}`}>
								{pointSortData.map((data, index) => {
									return(<li key={'point'+index}><SortToggleBtn pointSortData={data} pointSortDataChange={pointSortDataChange}/></li>)
								})}
							</ul>
					</div>
				</div>
				<h2 className={styles.title}>絞り込み</h2>
				<div className={styles.selectTitle}>
					<p>コメント</p>
					<button type="button" className={`${commentAllBtnActive && styles.active} ${styles.allSelectBtn}`} onClick={AllChangeComment} >すべて{commentAllBtnActive ? '解除' :'選択'}</button>
				</div>                

				<ul className={`${styles.list} ${styles.commentOnly}`}>
					<li>
						<input
							type="checkbox" name="commentOnly" id="positive"
							className={`${isCommentChecked[0] && styles.active}`}
							value={isCommentChecked[0]}
							onChange={() => changeComment(0)}
						/>
						<label htmlFor="positive">良い点</label>
					</li>
					<li>
						<input
							type="checkbox" name="commentOnly" id="negative"
							className={`${isCommentChecked[1] && styles.active}`}
							value={isCommentChecked[1]}
							onChange={() => changeComment(1)}
						/>
						<label htmlFor="negative">改善点</label>
					</li>
					<li>
						<input
							type="checkbox" name="commentOnly" id="commentOther"
							className={`${isCommentChecked[2] && styles.active}`}
							value={isCommentChecked[2]}
							onChange={() => changeComment(2)}
						/>
						<label htmlFor="commentOther">その他</label>
					</li>
				</ul>
				<div className={styles.selectTitle}>
					<p>来場区分</p>
					<button type="button" className={`${divisionAllBtnActive && styles.active} ${styles.allSelectBtn}`} onClick={AllChangeDivision} >すべて{divisionAllBtnActive ? '解除' :'選択'}</button>
				</div>
				<ul className={`${styles.list} ${styles.division}`}>
					{divisionNames.map((data, index) => {
							return(
								<li key={'division' + index}>
								<input
									type="checkbox" name="division" id={data}
									className={`${isDivisionChecked[index] && styles.active}`}
									value={isDivisionChecked[index]}
									onChange={() => changeDivision(index)}
								/>
								<label htmlFor={data}>{data}</label>
							</li>
							)
					})}
				</ul>
				<button type="button" className={styles.btnClose} onClick={() => closeDialog()}>閉じる</button>
			</div>
		</div>
	);
}

export default GetReviewSortDialog;