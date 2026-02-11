import React, { useState, useRef, useEffect, useContext } from 'react';
import Styles from './VisitorLogin.module.css'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Camera from './components/camera/Camera'
import ScanBusinessCardForm from './components/scanbusinesscardform/ScanBusinessCardForm'
import LoadingMessage from './components/loadingmessage/LoadingMessage';
import { AppContext } from '../../context/AppContextProvider';




const VisitorLogin = () => {
	const [text, setText] = useState({name: '',	companyName: '', email: ''});
	const [visitorType, setVisitorType] = useState('0');
	const [isImageCaptured, setIsImageCaptured] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const {loading, setLoading } = useContext(AppContext);

	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	const startCamera = async () => {
			try {
					if (videoRef.current && videoRef.current.srcObject) {
						const tracks = videoRef.current.srcObject.getTracks();
						tracks.forEach(track => track.stop());
						videoRef.current.srcObject = null;
					}
					const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

					if (videoRef.current) {
						videoRef.current.srcObject = newStream;
						videoRef.current.onloadedmetadata = async () => {
							try {
								await videoRef.current.play();
							} catch (playError) {
							}
						};
					}
			} catch (error) {
				// console.error("カメラへのアクセスエラー: ", error);
			}
	};

	useEffect(() => {
		const currentVideoRef = videoRef.current; // ここで変数に保存
		startCamera();
		return () => {
				if (currentVideoRef && currentVideoRef.srcObject) {
						const tracks = currentVideoRef.srcObject.getTracks();
						tracks.forEach(track => track.stop());
				}
		};
	}, []);

	const handleCapture = async () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;

		if (!isImageCaptured) {
			if (canvas && video) {
				const context = canvas.getContext('2d');
				context.drawImage(video, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(async (blob) => {
					if (blob) {
						setLoading(true);
						await recognizeText(blob);
						setLoading(false);
					}
				}, 'image/png');
				setIsImageCaptured(true);
			}
		} else {
			setIsImageCaptured(false);
		}
	};

	const handleNoCardButtonClick = () => {
		setIsImageCaptured(true);
		setText({ name: '', companyName: '', email: '' });
        setVisitorType('0');
        setErrorMessage('');
	}

	const recognizeText = async (blob) => {
		const base64Image = await blobToBase64(blob);
		const requestBody = {
			requests: [
				{
					image: { content: base64Image },
					features: [{ type: 'TEXT_DETECTION', maxResults: 10 }],
				},
			],
		};

		try {
			const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_VISION_API_KEY
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error(`HTTPエラー! ステータス: ${response.status}`);
			}

			const data = await response.json();
			const detectedText = data.responses[0].fullTextAnnotation.text;

			await handleAnalyzeAndFill(detectedText);
		} catch (error) {
			// console.error('Vision APIエラー:', error);
		}
	};

	const handleAnalyzeAndFill = async (text) => {
		const entities = await analyzeWithGemini(text);
		fillFormWithEntities(entities);
	};

	const analyzeWithGemini = async (inputText) => {
		const prompt = `以下のテキストから名前、メールアドレス、会社名をそれぞれ抽出してください。形式はPERSON（名前）、MAIL（メールアドレス）、ORGANIZATION（会社名）で、それぞれの値を対応するプロパティに出力してください。

		- 名前は漢字を優先してください。
		- メールアドレスは「@」を含む形式で指定してください。
		- 会社名は最も妥当なもので、株式会社という文字列がある場合はそれを含むものを優先して選んでください。
		- 会社名に当てはまるものがなく、学校名だと思われるものと学科名だと思われるものがある場合は、学校名ではなく学科名をORGANIZATIONに出力してください。
		- 極力各要素を埋めるようにしてください。

		もしエンティティが見つからない場合は、絶対にnullは返さず、空文字列""を返してください。

		最終応答は、"{"で始まり"}"で終わるJSONのみを出力し、JSON以外の文字は一切応答に含めないでください。
		出力は次のような形式にしてください（この例のフォーマットは必ず守ってください）:
		{
			"PERSON": "<名前>",
			"MAIL": "<メールアドレス>",
			"ORGANIZATION": "<会社名>"
		}

		テキスト: ${inputText}
		`;


		try {
			const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
			const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

			const result = await model.generateContent(prompt);
			const textResponse = result.response.text();
			const cleanedResponse = cleanResponse(textResponse);
			const entities = JSON.parse(cleanedResponse);
			fillFormWithEntities(entities);
		} catch (error) {
			console.error('Gemini API エラー:', error);
		}
	};

	const cleanResponse = (generatedResponse) => {
		return generatedResponse
		.replace(/```json/, '')
		.replace(/```/, '')
		.trim();
	}

	const fillFormWithEntities = (entities) => {
		if (!entities) return;

		// 各フィールドの値をnullまたはundefinedの場合は空文字列に変換
		const name = entities.PERSON || '';
		const email = entities.MAIL || '';
		const companyName = entities.ORGANIZATION || '';

		setText({ name, email, companyName });
	};


	const blobToBase64 = (blob) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result.split(',')[1]);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	};



	const handleRescan = async () => {
		setIsImageCaptured(false);
		setText({ name: '', companyName: '', email: '' }); // テキストもリセット
		await startCamera(); // カメラを再起動
	};

	return (
		<div className={Styles.container}>
			{!isImageCaptured ? (
				<Camera
					videoRef={videoRef}
					handleCapture={handleCapture}
					onNoCardButtonClick={handleNoCardButtonClick}
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
		<LoadingMessage
			loading={loading}
			canvasRef={canvasRef}
		/>
		</div>
	);
};

export default VisitorLogin;