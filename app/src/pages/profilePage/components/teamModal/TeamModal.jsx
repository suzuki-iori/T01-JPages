import React, { useEffect, useState, useContext } from 'react';
import ReactModal from 'react-modal';
import Ajax from '../../../../lib/Ajax';
import Styles from './TeamModal.module.css'; 
import { AppContext } from '../../../../context/AppContextProvider';

ReactModal.setAppElement('#root');

const TeamModal = ({ isOpen, handleCloseModal, team, parameter, onSave }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [parameters, setParameters] = useState([]);
	const [originalData, setOriginalData] = useState({ name: '', description: '', parameters: [] });
	const [errorMessages, setErrorMessages] = useState([]);
	const [teamError, setTeamError] = useState({name: '', description: ''});
	const [submitError, setSubmitError] = useState('');
	
	// context
	const {loginToken, setLoading, setToast } = useContext(AppContext);

	// チーム情報をセット
	useEffect(() => {
		if (team) {
			setName(team.name);
			setDescription(team.detail);
			const newParameters = parameter.map(param => ({ ...param }));
			setParameters(newParameters);
			setOriginalData({ name: team.name, description: team.detail, parameters: newParameters });
		}
	}, [team, parameter]);

	// パラメーターの変更
	const handleParameterChange = (index, field, newValue) => {
		setSubmitError('')
		const updatedParameters = [...parameters];
	
		if (field === 'name') {
			updatedParameters[index].name = newValue; 
			if (newValue.length > 7) {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = 'パラメーターは7文字以内で入力してください';
					return newErrors;
				});
			} else if (newValue.length === 0){
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = 'パラメーター名を入力してください';
					return newErrors;
				})
			} else {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = '';
					return newErrors;
				});
			}
		} else if (field === 'score') {
			updatedParameters[index].score = newValue;
			if (newValue > 120) {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = '値は120以内にしてください';
					return newErrors;
				})
			} else if (newValue < 0) {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = '値は0以上にしてください';
					return newErrors;
				})
			} else if (!newValue) {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = '値を入力してください';
					return newErrors;
				})
			} else if (isNaN(newValue)) {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = '数値を入力してください';
					return newErrors;
				})
			} else {
				setErrorMessages(prev => {
					const newErrors = [...prev];
					newErrors[index] = '';
					return newErrors;
				})
			}
		}
		setParameters(updatedParameters);
	};
	
	const handleTeamInfoChange =(field, value) => {
		setSubmitError('')
		if (field === 'name') {
			setName(value);
			if (value.length > 255) {
				setTeamError(prev => ({...prev, name: 'システム名は255文字以内で入力してください'}));
			} else {
				setTeamError(prev => ({...prev, name: ''}));
			}
		} else if (field === 'description') {
			setDescription(value);
			if (value.length > 255) {
				setTeamError(prev => ({...prev, description: '説明は255文字以内で入力してください'}));
			} else {
				setTeamError(prev => ({...prev, description: ''}));
			}
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		const nonValueParam = parameters.filter((parameter) => parameter.name.length === 0);
		const overLengthParam = parameters.filter((parameter) => parameter.name.length > 7);
		const unenteredParam = parameters.filter((parameter) => parameter.score === '' || parameter.score === null);
		const overValueParam = parameters.filter((parameter) => parameter.score > 120);
		const notEnoughValueParam = parameters.filter((parameter) => parameter.score < 0);
		if (overLengthParam.length > 0) {
			setSubmitError('パラメーター名は7文字以内で入力してください');
			return;
		} else if (nonValueParam.length > 0) {
			setSubmitError('パラメーター名を入力してください');	
			return;
		} else if (unenteredParam.length > 0) {
			setSubmitError('パラメーターの値を入力してください');
			return;
		} else if (overValueParam.length > 0) {
			setSubmitError('パラメーターの値は120以内にしてください');
			return;
		} else if (notEnoughValueParam.length > 0) {
			setSubmitError('パラメーターの値は0以上にしてください');
			return;
		} else if (name.length > 255) {
			setSubmitError('システム名は255文字以内で入力してください');
			return;
		} else if (description.length > 255) {
			setSubmitError('説明は255文字以内で入力してください');
			return;
		}

		// チーム名と詳細の変更を確認
		const updates = {};
		if (name !== team.name) updates.name = name;
		if (description !== team.detail) updates.detail = description;

		// パラメータの変更を確認
		const parameterUpdates = parameters.filter((param, index) => {
			return (
				param.name !== parameter[index].name || param.score !== parameter[index].score
			)}).map(param => ({ id: param.id, name: param.name, score: param.score }));
		// チーム情報の更新
		if (Object.keys(updates).length > 0) {
			setLoading(true);
			Ajax(loginToken, `team/${team.id}`, 'PUT', { num: team.num, grade: team.grade, name: name, detail: description })
			.then((data) => {
				if(data.status === 'ParameterError') {
					setToast({toast: true, state: 'profile', message: '入力情報にエラーがあります。もう一度入力してください。'})
				}
				else if(data.status === 'Unauthorized') {
					setToast({toast: true, state: 'visitorLogin', message: '変更権限がありません。ログインしなおしてください。'})
				}
				else if(data.status === 'failure') {
					// 失敗
					setToast({toast: true, state: 'teamTop', message: 'チームが存在しません。'})
				}
				else if(data.status === 'TokenError') {
					// 失敗
					setToast({toast: true, state: 'visitorLogin', message: '認証エラーです。もう一度ログインしてください。'})
				}
				setLoading(false);
			});
			}
			// 変更された分だけパラメータを更新
			for (const paramUpdate of parameterUpdates) {
				setLoading(true);
				Ajax(loginToken, `parameter/${paramUpdate.id}`, 'PUT', { name: paramUpdate.name, score: paramUpdate.score })
				.then((data) => {
					if(data.status === 'ParameterError') {
						setToast({toast: true, state: 'profile', message: '入力情報にエラーがあります。もう一度入力してください。'})
					}
					else if(data.status === 'Unauthorized') {
						setToast({toast: true, state: 'visitorLogin', message: '変更権限がありません。ログインしなおしてください。'})
					}
					else if(data.status === 'failure') {
						// 失敗
						setToast({toast: true, state: 'teamTop', message: 'チームが存在しません。'})
					}
					else if(data.status === 'TokenError') {
						// 失敗
						setToast({toast: true, state: 'visitorLogin', message: '認証エラーです。もう一度ログインしてください。'})
					}
						setLoading(false);
				});
			}
			onSave({ ...team, name, detail: description, parameters });
			handleCloseModal();
		};

	const handleCancel = () => {
		// 元のデータにリセット
		setName(originalData.name);
		setDescription(originalData.description);
		setParameters(originalData.parameters);
		handleCloseModal();
	};

	return (
		<ReactModal isOpen={isOpen} onRequestClose={handleCloseModal} className={Styles.modal} overlayClassName={Styles.overlay}>
			<div className={Styles.inputContainer}>
			{parameters.map((param, index) => (
				<div key={param.id}>
					<div  className={Styles.paramContainer}>
						<p className={Styles.index}>{index + 1}</p>
						<input 
							type="text" 
							value={param.name}
							onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
							className={Styles.paramName}
						/>
						<input 
							type="number" 
							pattern="^[0-9]+$"
							value={param.score} 
							onChange={(e) => handleParameterChange(index, 'score', e.target.value)} 
							className={Styles.paramNum}
						/>
						<small className={Styles.percentage}>/120%</small>
					</div>
					{errorMessages[index] && <p className={Styles.errorMessage}>{errorMessages[index]}</p>}
				</div>
			))}
			<small className={Styles.example}>例: 仲の良さ、やる気</small>
			</div>
			<div className={Styles.teaminfoContainer}>
				<div className={Styles.nameContainer}>
					<label className={Styles.nameLabel} htmlFor='teamName'>システム名</label>
					<input 
						type="text" 
						value={name}
						onChange={(e) => handleTeamInfoChange('name', e.target.value)}
						placeholder='システム名'
						id='teamName'
						className={Styles.teamName}
					/>
				</div>
				{teamError.name && <p className={Styles.teamError}>{teamError.name}</p>}
				<div className={Styles.descContainer}>
					<label className={Styles.descLabel} htmlFor='teamDesc'>説明</label>
					<textarea 
						value={description}
						onChange={(e) => handleTeamInfoChange('description', e.target.value)}
						placeholder="説明"
						id='teamDesc'
						className={Styles.teamDesc}
					/>
				</div>
				{teamError.description && <p className={Styles.teamError}>{teamError.description}</p>}
			</div>
			{submitError && <p className={Styles.submitError}>{submitError}</p>}
			<div className={Styles.buttonContainer}>
					<button onClick={handleCancel} className={Styles.cancelButton}>× キャンセル</button>
					<button onClick={handleSubmit} className={Styles.submitButton}>保存</button>
			</div>
		</ReactModal>
	);
};

export default TeamModal;
