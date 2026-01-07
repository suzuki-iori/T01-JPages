import React, { useEffect, useState } from 'react';
import styles from './GetReviewField.module.scss';
import GetOneReview from '../../../../components-old/molecules/getOneReview/GetOneReview';
import GetReviewSortDialog from '../getReviewSortDialog/GetReviewSortDialog';
import GetReviewComment from '../../../../components-old/molecules/getReviewComment/GetReviewComment';
import { useContext } from 'react';
import { AppContext } from '../../../../context/AppContextProvider';

function GetReviewField(props) {
	const {
		setAppState
	} = useContext(AppContext);

	const {getReviewData, GetReviewEditData, setGetReviewEditData} = props;

	//ダイアログの表示
	const [dialog, setDialog] = useState(false);
	//日時Sort
	const [timeSortStatus, setTimeSortStatus] = useState('desc');
	//ポイントSort
	const pointStatus = ['off', 'desc', 'asc'];
	const [pointSortData, setpointSortData] = useState([
			{'name': 'total', 'status': 'off'},
			{'name': 'plan', 'status': 'off'},
			{'name': 'design', 'status': 'off'},
			{'name': 'skill', 'status': 'off'},
			{'name': 'present', 'status': 'off'}
	]);
	//アクティブになったポイントデータ
	const [activeSortPoint, setActiveSortPoint] = useState({'name': 'total', 'status': 'off'});
	//来場区分filter項目
	const [filterDivisionValiables, setFilterDivisionValiables] = useState([]); 
	//来場区分
	const divisionNames = ['企業', '教員', '学生', '卒業生', 'その他'];
	//コメントfilter項目
	const [filterCommentValiables, setFilterCommentValiables] = useState([]); 

	/**
	 * ポイントSort
	 */
	const pointSortDataChange = (name) => {
		let newPointSortData = [...pointSortData];
		newPointSortData.forEach(element => {
			if(element.name === name) {
				let statusIndex = pointStatus.indexOf(element.status);
				element.status = pointStatus[(statusIndex + 1) % pointStatus.length];
				setActiveSortPoint(element);
			} else {
				element.status = pointStatus[0]; //offにする
			}
		});
		setpointSortData(newPointSortData);
	}

	/**
	 * くちこみEdit
	 */
	useEffect(() => {
		let newGetReviewData = structuredClone(getReviewData); //コピー　×...= [...getReviewData]
		//Filter
		newGetReviewData.forEach(e => {
			e.comment = Object.fromEntries(
				// 未入力のコメント項目は表示しない
				Object.entries(e.comment).filter(([_, value]) => value)
			);
		});
		newGetReviewData.forEach((e) => {
			e.comment = Object.fromEntries(
				// コメントfilter
				Object.entries(e.comment).filter(([key, _]) => {
					let newfilterCommentValiables = filterCommentValiables.length > 0 ? filterCommentValiables : ['positive', 'negative', 'other'];
					return newfilterCommentValiables.some(elm => elm === key);
				})
			);
		})
		newGetReviewData = newGetReviewData.filter(data => {
			//来場区分filter
			let division = data.visitor ? data.visitor.division : 3; //divisionがなかったら「学生」
			let newFilterDivisionValiables = filterDivisionValiables.length > 0 ? filterDivisionValiables : [1,2,3,4,5];
			return newFilterDivisionValiables.some(elm => elm === division);
		});
		//Sort
		newGetReviewData = newGetReviewData.sort((a, b) => {
				if(activeSortPoint.status === 'desc') { //ポイント高い順
					// b.point[activeSortPoint.name] - a.point[activeSortPoint.name];
					if(b.point[activeSortPoint.name] < a.point[activeSortPoint.name]) {
						return -1
					}
					if(b.point[activeSortPoint.name] > a.point[activeSortPoint.name]) {
						return 1
					}
				} else if (activeSortPoint.status === 'asc'){
					if(a.point[activeSortPoint.name] < b.point[activeSortPoint.name]) {
						return -1
					}
					if(a.point[activeSortPoint.name] > b.point[activeSortPoint.name]) {
						return 1
					}
				}
				if(timeSortStatus === 'desc') { //新着順
					return new Date(b.created_at) - new Date(a.created_at);
				} else if(timeSortStatus === 'asc') {
					return new Date(a.created_at) - new Date(b.created_at);
				}

		});

		setGetReviewEditData(newGetReviewData);
	}, [getReviewData, timeSortStatus, pointSortData, filterDivisionValiables, filterCommentValiables]);
	
	return (
		<div className={styles.showReviews}>
			<div className={styles.btn}>
				<button className={styles.rankingBtn} onClick={() => setAppState('ranking')}>&lt; ランキング</button>
				<button className={styles.editBtn} type="button" onClick={() => setDialog(true)}>絞り込み</button>
			</div>
			{
				GetReviewEditData.length === 0?
				<p className={styles.nullMsg}>結果が見つかりませんでした</p>
				:
				filterCommentValiables.length === 0 ? 
				<ul className={styles.getReviews}>
					{GetReviewEditData.map((data) => {
						let division = data.visitor ? data.visitor.division : 3; //divisionがなかったら「学生」
						let divisionName = divisionNames[division - 1];
						
						return(
							<li key={'getReview-' + data.id}>
								<GetOneReview
									getReviewOneData={data}
									divisionName={divisionName}
								/>
							</li>
						)
					})}
				</ul> 
				: 
				<GetReviewComment
					GetReviewEditData={GetReviewEditData}
					divisionNames={divisionNames}
				/>
			}
			{dialog && 
				<GetReviewSortDialog
					setDialog={setDialog}
					pointSortData={pointSortData} pointSortDataChange={pointSortDataChange}
					timeSortStatus={timeSortStatus} setTimeSortStatus={setTimeSortStatus}
					divisionNames={divisionNames}
					filterDivisionValiables={filterDivisionValiables} setFilterDivisionValiables={setFilterDivisionValiables}
					filterCommentValiables={filterCommentValiables} setFilterCommentValiables={setFilterCommentValiables}
				/>
			}
		</div>
	);
}

export default GetReviewField;