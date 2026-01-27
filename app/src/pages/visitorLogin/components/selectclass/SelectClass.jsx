import React from "react";
import styles from "./selectClass.module.css";

const SelectClass = (props) =>  {
	const {visitorType, setVisitorType, setErrorMessage, loading } = props;
	return (
		<>
			<select
				className={styles["select-box"]}
				value={visitorType}
				onChange={e => {
					setVisitorType(e.target.value);
					// エラーメッセージをリセット
					if (e.target.value !== '0') {
						setErrorMessage('');
					}
				}}
			>
				<option value="0">来場者区分</option>
				<option value="1">企業の方</option>
				<option value="2">教員</option>
				<option value="3">日本電子専門学校生</option>
				<option value="4">卒業生</option>
				<option value="5">その他の方</option>
			</select>

		</>
	)
};
export default SelectClass;