import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import SelectClass from "../selectclass/SelectClass";
import SubmitButton from "../../../../components/submitbutton/SubmitButton";
import RescanButton from "../rescanButton/RescanButton";
import styles from "./scanBusinessCardForm.module.css";
import Ajax from "../../../../lib/Ajax";
import { AppContext } from "../../../../context/AppContextProvider";

// 来場者区分の定数
const VISITOR_TYPE = {
	UNSELECTED: '0',
	COMPANY: '1', //企業の方
	TEACHER: '2', //教職員の方
	STUDENT: '3', //学生の方
	GRADUATE: '4', //卒業生の方
	OTHER: '5', //その他
};

// 来場者区分に応じたplaceholder設定
const PLACEHOLDER_MAP = {
	[VISITOR_TYPE.COMPANY]: '会社名',
	[VISITOR_TYPE.TEACHER]: '学科・部署',
	[VISITOR_TYPE.STUDENT]: '学籍番号（例：23JZ0199）',
	[VISITOR_TYPE.GRADUATE]: '学科名（例：高度情報処理科）',
	[VISITOR_TYPE.OTHER]: '所属',
};

// 来場者区分に応じた注意書き
const AFFILIATION_NOTES = {
	[VISITOR_TYPE.GRADUATE]: '※学生時代の学科名を入力してください。\n例：高度情報処理科',
	[VISITOR_TYPE.OTHER]: '※所属には在籍中の組織名を入力してください。\n在校生のご家族の方は、所属に学生の氏名をご記入ください',
};

const ScanBusinessCardForm = ({
	visitorType,
	setVisitorType,
	setErrorMessage,
	errorMessage,
	text,
	setText,
	handleRescan,
}) => {
	const { setLoginToken, setLoginType, loading, setLoading, setToast } = useContext(AppContext);
	const [inputErrors, setInputErrors] = useState({ name: '', email: '', companyName: '' });

	// フォーム送信処理
	const handleSubmit = (ev) => {
		ev.preventDefault();

		if (!text.name || !text.email || !text.companyName) {
			setErrorMessage('すべての情報を入力してください');
			return;
		}
		if (text.name.length >= 256 || text.email.length >= 256 || text.companyName.length >= 256) {
			setErrorMessage('情報は256文字以内で入力してください');
			return;
		}

		if (visitorType === VISITOR_TYPE.UNSELECTED) {
			setErrorMessage('来場者区分を選択してください');
			return;
		}

		setErrorMessage('');
		setLoading(true);

		const req = {
			affiliation: text.companyName,
			name: text.name,
			email: text.email,
			division: Number(visitorType),
		};

		Ajax(null, 'visitor', 'POST', req)
			.then((data) => {
				if (data.status === 'failure') {
					setToast({ toast: true, state: 'visitorLogin', message: 'エラーが発生しました。' });
				} else if (data.status === 'ParameterError') {
					setErrorMessage('入力されたパラメーターが違います');
					setToast({ toast: true, state: 'visitorLogin', message: 'エラーが発生しました。もう一度お願いします。' });
				} else {
					setLoginToken(data.token);
					setLoginType('visitor');
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error('通信エラー:', error);
				setLoading(false);
			});
	};

	// 来場者区分に応じたplaceholderを取得
	const companyNamePlaceholder = useMemo(
		() => PLACEHOLDER_MAP[visitorType] || '所属',
		[visitorType]
	);

	// 来場者区分に応じた注意書きを取得
	const affiliationNote = useMemo(
		() => AFFILIATION_NOTES[visitorType] || null,
		[visitorType]
	);

	// 教員・学生選択時に所属フィールドを自動整形
	useEffect(() => {
		if (visitorType === VISITOR_TYPE.TEACHER || visitorType === VISITOR_TYPE.STUDENT) {
			setText(prevText => {
				let newCompanyName = prevText.companyName;

				// "科"が含まれていなければ全て消す
				if (!newCompanyName.includes("科")) {
					newCompanyName = "";
				} else if (newCompanyName.includes("日本電子専門学校")) {
					// "科"が含まれていて、"日本電子専門学校"も含まれている場合、その文字列だけを削除
					newCompanyName = newCompanyName.replace("日本電子専門学校", "").trim();
				}

				if (newCompanyName === prevText.companyName) {
					return prevText;
				}
				return { ...prevText, companyName: newCompanyName };
			});
		}
	}, [visitorType, setText]);

	const handleInputChange = useCallback((field, value) => {
		if (value.length > 255) {
			setInputErrors(prevErrors => ({ ...prevErrors, [field]: '255文字以内で入力してください' }));
		} else {
			setInputErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
		}

		setText(prevText => ({ ...prevText, [field]: value }));
		setErrorMessage('');
	}, [setText, setErrorMessage]);

	return (
		<form onSubmit={handleSubmit} className={styles["input-container"]}>
			<SelectClass
				visitorType={visitorType}
				setVisitorType={setVisitorType}
				setErrorMessage={setErrorMessage}
				loading={loading}
			/>

			<input
				className={styles["input-box"]}
				type="text"
				value={text.name}
				onChange={e => handleInputChange('name', e.target.value)}
				placeholder="氏名"
			/>
			{inputErrors.name && <div className={styles["warning"]}>{inputErrors.name}</div>}

			<input
				className={styles["input-box"]}
				type="email"
				value={text.email}
				onChange={e => handleInputChange('email', e.target.value)}
				placeholder="メールアドレス"
			/>
			{inputErrors.email && <div className={styles["warning"]}>{inputErrors.email}</div>}

			<input
				className={styles["input-box"]}
				type="text"
				value={text.companyName}
				onChange={e => handleInputChange('companyName', e.target.value)}
				placeholder={companyNamePlaceholder}
			/>
			{inputErrors.companyName && <div className={styles["warning"]}>{inputErrors.companyName}</div>}

			{affiliationNote && (
				<div className={styles["note"]}>
					{affiliationNote.split('\n').map((line, index) => (
						<React.Fragment key={index}>
							{line}
							{index < affiliationNote.split('\n').length - 1 && <br />}
						</React.Fragment>
					))}
				</div>
			)}

			{errorMessage && (
				<div className={styles["error-message"]} style={{ color: 'red' }}>
					{errorMessage}
				</div>
			)}

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