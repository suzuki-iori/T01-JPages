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
	const [originalData, setOriginalData] = useState({
		name: '',
		description: '',
		parameters: [],
	});
	
	// エラー状態を統一
	const [errors, setErrors] = useState({
		name: '',
		description: '',
		parameters: [], // 各パラメータのエラー
		submit: '' // サブミット時の全体エラー
	});

	const { loginToken, setLoading, setToast } = useContext(AppContext);

	// 初期セット
	useEffect(() => {
		if (!team) return;

		const clonedParams = parameter.map(p => ({ ...p }));

		setName(team.name || '');  // nullの場合は空文字列
		setDescription(team.detail || '');  // nullの場合は空文字列
		setParameters(clonedParams);
		setOriginalData({
			name: team.name || '',
			description: team.detail || '',
			parameters: clonedParams,
		});
		
		// エラーもリセット
		setErrors({
			name: '',
			description: '',
			parameters: Array(clonedParams.length).fill(''),
			submit: ''
		});
	}, [team, parameter]);

	// バリデーション関数（再利用可能）
	const validateParameterName = (value) => {
		if (!value || value.length === 0) {
			return 'パラメーター名を入力してください';
		}
		if (value.length > 7) {
			return 'パラメーターは7文字以内で入力してください';
		}
		return '';
	};

	const validateParameterScore = (value) => {
		if (value === '' || value === null || value === undefined) {
			return '値を入力してください';
		}
		const numValue = Number(value);
		if (isNaN(numValue)) {
			return '数値を入力してください';
		}
		if (numValue < 0) {
			return '値は0以上にしてください';
		}
		if (numValue > 120) {
			return '値は120以内にしてください';
		}
		return '';
	};

	const validateTeamName = (value) => {
		// nullチェックを追加
		if (!value) return '';
		if (value.length > 255) {
			return 'システム名は255文字以内で入力してください';
		}
		return '';
	};

	const validateDescription = (value) => {
		// nullチェックを追加
		if (!value) return '';
		if (value.length > 255) {
			return '説明は255文字以内で入力してください';
		}
		return '';
	};

	// パラメータ変更（リアルタイムバリデーションなし）
	const handleParameterChange = (index, field, value) => {
		setErrors(prev => ({ ...prev, submit: '' }));
		
		setParameters(prev => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	};

	// チーム情報変更（リアルタイムバリデーションなし）
	const handleTeamInfoChange = (field, value) => {
		setErrors(prev => ({ ...prev, submit: '' }));

		if (field === 'name') {
			setName(value);
		} else if (field === 'description') {
			setDescription(value);
		}
	};

	// サブミット時の全体バリデーション
	const validateAll = () => {
		const newErrors = {
			name: validateTeamName(name),
			description: validateDescription(description),
			parameters: parameters.map((param, index) => {
				const nameError = validateParameterName(param.name);
				if (nameError) return nameError;
				return validateParameterScore(param.score);
			}),
			submit: ''
		};

		// 最初のエラーをsubmitエラーとして設定
		if (newErrors.name) {
			newErrors.submit = newErrors.name;
		} else if (newErrors.description) {
			newErrors.submit = newErrors.description;
		} else {
			const paramError = newErrors.parameters.find(err => err !== '');
			if (paramError) {
				newErrors.submit = paramError;
			}
		}

		setErrors(newErrors);
		return !newErrors.submit;
	};

	// API呼び出し処理を分離
	const updateTeam = async () => {
		const response = await Ajax(
			loginToken,
			`team/${team.id}`,
			'PUT',
			{ num: team.num, grade: team.grade, name, detail: description }
		);
		
		if (response.status !== 'success') {
			throw new Error(response.status);
		}
	};

	const updateParameters = async (updatedParams) => {
		const promises = updatedParams.map(param =>
			Ajax(loginToken, `parameter/${param.id}`, 'PUT', {
				name: param.name,
				score: param.score
			})
		);
		
		const results = await Promise.all(promises);
		const failed = results.find(r => r.status !== 'success');
		if (failed) {
			throw new Error(failed.status);
		}
	};

	// エラーハンドリングを統一
	const handleApiError = (error) => {
		const errorStatus = error.message;
		
		const errorMap = {
			'ParameterError': {
				state: 'profile',
				message: '入力情報にエラーがあります。もう一度入力してください。'
			},
			'Unauthorized': {
				state: 'visitorLogin',
				message: '変更権限がありません。ログインしなおしてください。'
			},
			'failure': {
				state: 'teamTop',
				message: 'チームが存在しません。'
			},
			'TokenError': {
				state: 'visitorLogin',
				message: '認証エラーです。もう一度ログインしてください。'
			}
		};

		const errorInfo = errorMap[errorStatus] || {
			state: 'profile',
			message: 'エラーが発生しました。もう一度お試しください。'
		};

		setToast({ toast: true, ...errorInfo });
	};

	// 送信
	const handleSubmit = async (e) => {
		e.preventDefault();

		// バリデーション
		if (!validateAll()) {
			return;
		}

		const isTeamUpdated = name !== team.name || description !== team.detail;
		
		const updatedParameters = parameters
			.filter((param, index) => 
				param.name !== parameter[index].name ||
				param.score !== parameter[index].score
			)
			.map(param => ({
				id: param.id,
				name: param.name,
				score: param.score,
			}));

		try {
			setLoading(true);

			if (isTeamUpdated) {
				await updateTeam();
			}

			if (updatedParameters.length > 0) {
				await updateParameters(updatedParameters);
			}

			onSave({
				...team,
				name,
				detail: description,
				parameters,
			});

			handleCloseModal();
		} catch (error) {
			handleApiError(error);
		} finally {
			setLoading(false);
		}
	};

	// キャンセル
	const handleCancel = () => {
		setName(originalData.name);
		setDescription(originalData.description);
		setParameters(originalData.parameters);
		setErrors({
			name: '',
			description: '',
			parameters: Array(originalData.parameters.length).fill(''),
			submit: ''
		});
		handleCloseModal();
	};

	return (
		<ReactModal
			isOpen={isOpen}
			onRequestClose={handleCloseModal}
			className={Styles.modal}
			overlayClassName={Styles.overlay}
		>
			<div className={Styles.inputContainer}>
				{parameters.map((param, index) => (
					<div key={param.id} className={Styles.paramContainer}>
						<p className={Styles.index}>{index + 1}</p>
						<input
							type="text"
							value={param.name}
							onChange={e => handleParameterChange(index, 'name', e.target.value)}
							className={Styles.paramName}
						/>
						<input
							type="number"
							value={param.score}
							onChange={e => handleParameterChange(index, 'score', e.target.value)}
							className={Styles.paramNum}
						/>
						<small className={Styles.percentage}>/120%</small>
					</div>
				))}
				<small className={Styles.example}>例: 仲の良さ、やる気</small>
			</div>

			<div className={Styles.teaminfoContainer}>
				<div className={Styles.nameContainer}>
					<label htmlFor="teamName">システム名</label>
					<input
						id="teamName"
						type="text"
						value={name}
						onChange={e => handleTeamInfoChange('name', e.target.value)}
						className={Styles.teamName}
					/>
				</div>

				<div className={Styles.descContainer}>
					<label htmlFor="teamDesc">システム概要</label>
					<textarea
						id="teamDesc"
						value={description}
						onChange={e => handleTeamInfoChange('description', e.target.value)}
						className={Styles.teamDesc}
					/>
				</div>
			</div>

			{errors.submit && <p className={Styles.submitError}>{errors.submit}</p>}

			<div className={Styles.buttonContainer}>
				<button onClick={handleCancel} className={Styles.cancelButton}>
					<span className={Styles.cross}>×</span>
					<span className={Styles.cancel}>キャンセル</span>
				</button>
				<button onClick={handleSubmit} className={Styles.submitButton}>
					保存
				</button>
			</div>
		</ReactModal>
	);
};

export default TeamModal;