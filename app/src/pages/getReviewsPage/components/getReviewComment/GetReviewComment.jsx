import React, { useEffect, useState, useContext } from 'react';
import styles from './GetReviewComment.module.scss';
import GetComment from '../../../../components-old/atoms/getComment/GetComment';
import {AppContext} from '../../../../context/AppContextProvider';
function GetReviewComment(props) {
	const {
		GetReviewEditData,
		divisionNames,
	} = props;
	const {
		loginType
	} = useContext(AppContext);
	//編集済み表示データ
	const [CommentGetReviewData, setCommentGetReviewData] = useState([]);
	useEffect(() => {
		let newData = structuredClone(GetReviewEditData);
		newData = newData.filter(data => {
			return Object.keys(data.comment).length > 0;
		});
		setCommentGetReviewData(newData);
	}, [GetReviewEditData])

	return (
		<div className={styles.reviewComment}>
			{
				CommentGetReviewData.length === 0 ?
				<p className={styles.nullMsg}>結果が見つかりませんでした</p>
				:
				<ul className={styles.commentField}>
					{CommentGetReviewData.map((data, index) => {
						let division = data.visitor ? data.visitor.division : 3; //divisionがなかったら「学生」
						let divisionName = divisionNames[division - 1];
						let visitorName;
						if(data.visitor) {
							if(division === 2) { //「教員」は先生の名前(visitor.name)を表示
								visitorName = data.visitor.name;
							} else {
								visitorName = data.visitor.affiliation;
							}
						}
						return(
							<li key={`comment` + index}>
								<p className={styles.name}>
									<span className={styles.division}>{divisionName}</span>
									{loginType === 'student' && visitorName}
								</p>
								{Object.keys(data.comment).map((comment, index) => {
									return(
										<GetComment key={data.id + comment} name={comment} value={data.comment[comment]}/>
									)
								})}
							</li>
						)
					})}
				</ul>  
			}
		</div>
	);
}

export default GetReviewComment;