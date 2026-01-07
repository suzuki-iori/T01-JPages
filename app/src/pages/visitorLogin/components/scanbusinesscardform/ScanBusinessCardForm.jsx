import React, { useEffect, useState } from "react";
import SelectClass from "../selectclass/SelectClass";
import SubmitButton from "../../../../components/submitbutton/SubmitButton";
import RescanButton from "../rescanButton/RescanButton";
import styles from "./scanBusinessCardForm.module.css";

const  ScanBusinessCardForm =(props) =>  {
const { handleSubmit, visitorType, setVisitorType, setErrorMessage, errorMessage, text, setText, loading, handleRescan } = props;
const [inputErrors, setInputErrors] = useState({ name: '', email: '', companyName: ''});


useEffect(() => {
	if (visitorType === '2' || visitorType === '3') {
		let newCompanyName = text.companyName;

		// "科"が含まれていなければ全て消す
		if (!newCompanyName.includes("科")) {
				newCompanyName = "";
		} else if (newCompanyName.includes("日本電子専門学校")) {
				// "科"が含まれていて、"日本電子専門学校"も含まれている場合、その文字列だけを削除
				newCompanyName = newCompanyName.replace("日本電子専門学校", "").trim();
		}

		setText(prevText => ({ ...prevText, companyName: newCompanyName }));
	}
}, [visitorType]);

const handleInputChange = (field, value) => {
	if (value.length > 255) {
		setInputErrors(prevErrors => ({ ...prevErrors, [field]: '255文字以内で入力してください' }));
	} else {
		setInputErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
	}

	setText(prevText => ({ ...prevText, [field]: value }));
	setErrorMessage('');
};

return (
	<form onSubmit={handleSubmit} className={styles["input-container"]}>
		<SelectClass
			visitorType={visitorType}
			setVisitorType={setVisitorType}
			setErrorMessage={setErrorMessage}
			loading={loading}
		/>

		{errorMessage && <div className={styles["error-message"]} style={{ color: 'red' }}>{errorMessage}</div>}

		<input
			className={styles["input-box"]}
			type="text"
			value={text.name}
			onChange={e => handleInputChange('name', e.target.value)}
			placeholder="氏名"
		/>
		{inputErrors.name && <div className={styles["warning"]}>{inputErrors.name}</div>}
		{!loading && text.name === '' && <div className={styles["warning"]}>手入力をお願いします</div>}

		<input
			className={styles["input-box"]}
			type="email"
			value={text.email}
			onChange={e => handleInputChange('email', e.target.value)}
			placeholder="e-mail"
		/>
		{inputErrors.email && <div className={styles["warning"]}>{inputErrors.email}</div>}
		{!loading && text.email === '' && <div className={styles["warning"]}>手入力をお願いします</div>}

		<input
			className={styles["input-box"]}
			type="text"
			value={text.companyName}
			onChange={e => handleInputChange('companyName', e.target.value)}
			placeholder="所属"
		/>
		{inputErrors.companyName && <div className={styles["warning"]}>{inputErrors.companyName}</div>}
		{!loading && text.companyName === '' && <div className={styles["warning"]}>手入力をお願いします</div>}

		{(visitorType === '2' || visitorType === '3') && (<div>※所属には学科名を入力してください。<br />例：高度情報処理科</div>)}


		{(visitorType === '5') && (<div>※所属には在籍中の組織名を入力してください。</div>)}

		{!loading && (
			<div className={styles["button-container"]}>
				<RescanButton onClick={handleRescan} />
				<SubmitButton visualType={'submit'} />
			</div>
		)}
	</form>
);
};
export default ScanBusinessCardForm;