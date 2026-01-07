import React, { useState, useEffect, useContext } from 'react';
import Ajax from '../../lib/Ajax';
import Styles from './questionnaire.module.css';
import NumberInput from '../../components-old/molecules/numberinput/NumberInput';
import TextInput from '../../components-old/molecules/textinput/TextInput'
import QuestionnaireForm from './components/questionnaireform/QuestionnaireForm';
import BackButton from '../../components-old/atoms/backButton/BackButton'
import HelpButton from '../../components-old/atoms/helpButton/HelpButton';
import { AppContext } from '../../context/AppContextProvider';

const Questionnaire = () => {
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]); // 回答を配列で管理
	const [errorMessage, setErrorMessage] = useState('');

	const {setAppState, loginToken, setLoginToken, setLoginTeamId, setLoading, setToast, setIsPosted } = useContext(AppContext);

    useEffect(() => {
			setLoading(true);
			Ajax(null, 'questionnaire/1', 'GET')
			.then((data) => {
				if(data.status === 'failure') {
					// 失敗
					setToast({toast: true, state: 'question', message: 'エラーが発生しました。もう一度お試しください。'})
				} else {
					const sortedQuestions = data.questionnaire.sort((a, b) => a.order - b.order);
					setQuestions(sortedQuestions);

					// 初期回答の配列を質問データに基づいて作成
					const initialAnswers = sortedQuestions.map((question) => ({
							questionnaire_id: question.questionnaire_id,
							question_id: question.id,
							answer: question.isstring === 1 ? '' : null // テキスト/評価のプレースホルダー
					}));
					setAnswers(initialAnswers);
				}
				setLoading(false);
			})
			.catch((error) => {
				if (error.name === 'AbortError') {
					console.error('リクエストが中止されました');
				} else {
					console.error('データ取得エラー:', error);
				}
				setLoading(false);
			});
	}, []);
	

	const handleAnswerChange = (questionId, value) => {
		setAnswers((prevAnswers) =>
			prevAnswers.map((answer) =>
				answer.question_id === questionId ? { ...answer, answer: value } : answer
			)
		);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage('');

		// すべての質問に回答しているか確認
		const unansweredQuestions = answers.filter((answer) => answer.answer === '' || answer.answer === null);
		const overLengthQuestions = answers.filter((answer) => answer.answer.length > 255)
		if (unansweredQuestions.length > 0) {
			setErrorMessage('すべての質問に回答してください。');
			return;
		} else if (overLengthQuestions.length > 0) {
			setErrorMessage('回答は255文字以内で入力してください')
			return;
		}

		setLoading(true);
		Ajax(loginToken, 'survey/answer', 'POST', null)
		.then((data) => {
			if(data.status === 'failure') {
				// すでに投稿されている場合ホームに戻る
				setToast({toast: true, state: 'home', message: '回答済みです'})
			} else if (data.status === 'TokenError') {
				setToast({toast: true, state: 'visitorLogin', message: 'TokenError'})
			} else {
				const answerId = data.id;

				// 各回答をそれぞれのエンドポイントに送信
				for (const answer of answers) {
					const endpoint = questions.find(q => q.id === answer.question_id).isstring === 1
						? 'survey/answer/text'
						: 'survey/answer/number';

					const postData = {
						question_id: answer.question_id,
						answer_id: answerId,
						answer: answer.answer,
					};

					Ajax(loginToken, endpoint, 'POST', postData)
					.then((resData) => {
						if (resData.status === 'ParameterError') {
							setErrorMessage('入力情報に間違いがあります。');
							setToast({toast: true, state: 'question', message: '入力情報に間違いがあります。'})
						} else if (resData.status === 'TokenError') {
							setAppState('visitorLogin');
							setLoginToken('');
							setLoginTeamId('');
						} else {
							setAppState('home')
						}
					})
				}
				setIsPosted(true)
				setLoading(false);
			}
		}).catch((error) => {
			// console.error('通信エラー: ', error);
			setLoading(false);
		})

	};

	return (
		<div className={Styles["questionnaire-container"]}>
			<h1 className={Styles["title"]}>アンケート</h1>
			<HelpButton />
			<BackButton />
			<QuestionnaireForm
				handleSubmit={handleSubmit}
				questions={questions}
				TextInput={TextInput}
				handleAnswerChange={handleAnswerChange}
				NumberInput={NumberInput}
				answers={answers}
				errorMessage={errorMessage}
			/>
		</div>
	);
};

export default Questionnaire;