import React, { useRef, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Styles from "./camera.module.css";

const GEMINI_PROMPT = `以下のテキストから名前、メールアドレス、会社名をそれぞれ抽出してください。形式はPERSON（名前）、MAIL（メールアドレス）、ORGANIZATION（会社名）で、それぞれの値を対応するプロパティに出力してください。

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

テキスト: `;

const Camera = ({ onCapture, onNoCardButtonClick, canvasRef, setLoading }) => {
	const videoRef = useRef(null);

	// カメラを起動
	const startCamera = useCallback(async () => {
		try {
			if (videoRef.current?.srcObject) {
				const tracks = videoRef.current.srcObject.getTracks();
				tracks.forEach(track => track.stop());
				videoRef.current.srcObject = null;
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.onloadedmetadata = async () => {
					try {
						await videoRef.current.play();
					} catch (error) {
						// 再生エラーは無視
					}
				};
			}
		} catch (error) {
			// カメラアクセスエラーは無視
		}
	}, []);

	// カメラを停止
	const stopCamera = useCallback(() => {
		if (videoRef.current?.srcObject) {
			const tracks = videoRef.current.srcObject.getTracks();
			tracks.forEach(track => track.stop());
			videoRef.current.srcObject = null;
		}
	}, []);

	// マウント時にカメラ起動、アンマウント時に停止
	useEffect(() => {
		startCamera();
		return () => stopCamera();
	}, [startCamera, stopCamera]);

	// BlobをBase64に変換
	const blobToBase64 = (blob) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result.split(',')[1]);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	};

	// Vision APIでテキスト検出
	const detectTextFromImage = async (blob) => {
		const base64Image = await blobToBase64(blob);

		const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_VISION_API_KEY,
			},
			body: JSON.stringify({
				requests: [{
					image: { content: base64Image },
					features: [{ type: 'TEXT_DETECTION', maxResults: 10 }],
				}],
			}),
		});

		if (!response.ok) {
			throw new Error(`Vision API HTTPエラー: ${response.status}`);
		}

		const data = await response.json();
		return data.responses[0]?.fullTextAnnotation?.text || '';
	};

	// Gemini APIでエンティティ抽出
	const extractEntitiesWithGemini = async (text) => {
		const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const result = await model.generateContent(GEMINI_PROMPT + text);
		const responseText = result.response.text();
		const cleanedResponse = responseText
			.replace(/```json/g, '')
			.replace(/```/g, '')
			.trim();

		return JSON.parse(cleanedResponse);
	};

	// 名刺画像からフォームデータを抽出
	const extractBusinessCardData = async (blob) => {
		try {
			const detectedText = await detectTextFromImage(blob);

			if (!detectedText) {
				return { name: '', email: '', companyName: '' };
			}

			const entities = await extractEntitiesWithGemini(detectedText);

			return {
				name: entities.PERSON || '',
				email: entities.MAIL || '',
				companyName: entities.ORGANIZATION || '',
			};
		} catch (error) {
			console.error('名刺OCRエラー:', error);
			return { name: '', email: '', companyName: '' };
		}
	};

	// 撮影ボタンクリック時
	const handleCapture = async () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;

		if (!canvas || !video) return;

		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			if (blob) {
				setLoading(true);
				const formData = await extractBusinessCardData(blob);
				setLoading(false);
				onCapture(formData);
			}
		}, 'image/png');
	};

	return (
		<div className={Styles["camera"]}>
			<video autoPlay muted playsInline ref={videoRef} className={Styles["video"]} />
			<div className={Styles.frame}></div>
			<p className={Styles.message}>名刺を撮影してください</p>
			<button type='button' className={Styles.noCardButton} onClick={onNoCardButtonClick}>
				名刺がない方はこちら
			</button>
			<button className={Styles["capture-btn"]} onClick={handleCapture}>●</button>
		</div>
	);
};

export default Camera;