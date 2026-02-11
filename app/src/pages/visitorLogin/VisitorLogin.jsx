import React, { useState, useRef, useContext } from 'react';
import Styles from './VisitorLogin.module.css';
import Camera from './components/camera/Camera';
import ScanBusinessCardForm from './components/scanbusinesscardform/ScanBusinessCardForm';
import LoadingMessage from './components/loadingmessage/LoadingMessage';
import { AppContext } from '../../context/AppContextProvider';

const INITIAL_FORM_STATE = { name: '', companyName: '', email: '' };

const VisitorLogin = () => {
	const [text, setText] = useState(INITIAL_FORM_STATE);
	const [visitorType, setVisitorType] = useState('0');
	const [isImageCaptured, setIsImageCaptured] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const { loading, setLoading } = useContext(AppContext);
	const canvasRef = useRef(null);

	// カメラで撮影完了時のコールバック
	const handleCapture = (formData) => {
		setText(formData);
		setIsImageCaptured(true);
	};

	// 手入力ボタンクリック時
	const handleNoCardButtonClick = () => {
		setIsImageCaptured(true);
		setText(INITIAL_FORM_STATE);
		setVisitorType('0');
		setErrorMessage('');
	};

	// 再スキャンボタンクリック時
	const handleRescan = () => {
		setIsImageCaptured(false);
		setText(INITIAL_FORM_STATE);
	};

	return (
		<div className={Styles.container}>
			{!isImageCaptured ? (
				<Camera
					onCapture={handleCapture}
					onNoCardButtonClick={handleNoCardButtonClick}
					canvasRef={canvasRef}
					setLoading={setLoading}
				/>
			) : (
				<ScanBusinessCardForm
					visitorType={visitorType}
					setVisitorType={setVisitorType}
					setErrorMessage={setErrorMessage}
					errorMessage={errorMessage}
					text={text}
					setText={setText}
					handleRescan={handleRescan}
				/>
			)}
			<LoadingMessage loading={loading} canvasRef={canvasRef} />
		</div>
	);
};

export default VisitorLogin;