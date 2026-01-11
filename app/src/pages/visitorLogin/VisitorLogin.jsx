import React, { useState, useRef, useEffect, useContext } from 'react'; 
import Styles from './VisitorLogin.module.css'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Ajax from '../../lib/Ajax';
import Camera from './components/camera/Camera'
import ScanBusinessCardForm from './components/scanbusinesscardform/ScanBusinessCardForm'
import LoadingMessage from './components/loadingmessage/LoadingMessage';
import { AppContext } from '../../context/AppContextProvider';

const VisitorLogin = () => {
	const [text, setText] = useState({name: '',	companyName: '', email: ''});
	const [visitorType, setVisitorType] = useState('0');
	const [isImageCaptured, setIsImageCaptured] = useState(false); 
	const [errorMessage, setErrorMessage] = useState('');

	const {setLoginToken,  setLoginType, loading, setLoading, setToast } = useContext(AppContext);

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
			const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_GOOGLE_VISION_API_KEY}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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

	const genAI = new GoogleGenerativeAI(`${process.env.REACT_APP_GOOGLE_GEMINI_API_KEY}`);
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
		console.log(prompt);
		try {
			const result = await model.generateContent(prompt);
			const textResponse = result.response.text();
			const cleanedResponse = cleanResponse(textResponse);
			const entities = JSON.parse(cleanedResponse);
			fillFormWithEntities(entities);
		} catch (error) {
			// console.error('レスポンス解析エラー:', error);
		}
	};

	const cleanResponse = (generatedResponse) => {
		console.log(generatedResponse);
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

	const handleSubmit = (ev) => {
		ev.preventDefault();

		if (!text.name || !text.email || !text.companyName) {
			setErrorMessage('すべての情報を入力してください');
			return
		} else if (text.name.length >= 256 || text.email.length >= 256 || text.companyName.length >= 256) {
			setErrorMessage('情報は256文字以内で入力してください')
			return
		} else {
			setErrorMessage('');
		}

		if (visitorType === '0') {
				setErrorMessage('来場者区分を選択してください');
				return; // これ以降の処理を中断
		} else {
				setErrorMessage(''); // エラーメッセージをリセット
		}
		
		// 訪問者区分に基づいてdivisionを決定
		let division = 0; // デフォルト値
		switch (visitorType) {
			case "1":
				division = 1; // 企業の方
				break;
			case "2":
				division = 2; // 教員
				break;
			case "3":
				division = 3; // 日本電子専門学校生
				break;
			case "4":
				division = 4; // 卒業生
				break;
			case "5":
				division = 5; // その他
				break;
			default:
				break;
		}

		setLoading(true);

		const req = {
			affiliation: text.companyName,
			// employment_target_id: '8011105000934', // 法人番号を仮で設定
			name: text.name,
			email: text.email,
			division: division // リクエストボディにdivisionを追加
		};

		Ajax(null, 'visitor', 'POST', req)
		.then((data) => {
			if(data.status === 'failure') {
				// 失敗
				setToast({toast: true, state: 'visitorLogin', message: 'エラーが発生しました。'})
			} else if (data.status === 'ParameterError'){
				setErrorMessage('入力されたパラメーターが違います');
				setToast({toast: true, state: 'visitorLogin', message: 'エラーが発生しました。もう一度お願いします。'})
			} else {
				setLoginToken(data.token);
				setLoginType('visitor');
			}
			setLoading(false);
		}).catch((error) => {
			console.error('通信エラー:', error);
			setLoading(false);
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
					handleSubmit={handleSubmit}
					visitorType={visitorType}
					setVisitorType={setVisitorType}
					setErrorMessage={setErrorMessage}
					errorMessage={errorMessage}
					text={text}
					loading={loading}
					setText={setText}
					handleRescan={handleRescan} // 追加
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