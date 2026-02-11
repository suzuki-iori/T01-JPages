import { useContext, useState } from "react";
import Ajax from "../../../../lib/Ajax";
import SubmitButton from "../../../../components/submitbutton/SubmitButton";
import TextInput from "../textinput/TextInput";
import NumberInput from "../numberinput/NumberInput"
import { AppContext } from "../../../../context/AppContextProvider";
import styles from "./questionnaireForm.module.css"

function QuestionnaireForm({ questions, answers, setAnswers }) {
	const [errorMessage, setErrorMessage] = useState('');
	const { setAppState, loginToken, setLoginToken, setLoginTeamId, setLoading, setToast, setIsPosted } = useContext(AppContext);

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
		const overLengthQuestions = answers.filter((answer) => typeof answer.answer === 'string' && answer.answer.length > 255)
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
		<>
			<form className={styles["questionnaire-form"]} onSubmit={handleSubmit}>
				{questions.map((question, index) => (
					<div key={index} className={styles["question-item"]}>
						<label className={styles["question-label"]}>{question.question}</label>
						{question.isstring === 1 ? (
							<TextInput question={question} handleAnswerChange={handleAnswerChange} />
						) : (
							<NumberInput answers={answers} question={question} handleAnswerChange={handleAnswerChange} />
						)}
					</div>
				))}
				{errorMessage && (
					<p className={styles["error-message"]}>{errorMessage}</p>
				)}
				<SubmitButton visualType={"submit"}/>
			</form>
		</>
	)
}
export default QuestionnaireForm;