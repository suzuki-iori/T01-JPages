import React, { useState, useEffect, useContext } from 'react';
import Ajax from '../../lib/Ajax';
import Styles from './questionnaire.module.css';
import QuestionnaireForm from './components/questionnaireform/QuestionnaireForm';
import BackButton from './components/backButton/BackButton'
import HelpButton from '../../components/helpButton/HelpButton';
import { AppContext } from '../../context/AppContextProvider';

const Questionnaire = () => {
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);

	const { setLoading, setToast } = useContext(AppContext);

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
	}, [setLoading, setToast]);

	return (
		<div className={Styles["questionnaire-container"]}>
			<h1 className={Styles["title"]}>アンケート</h1>
			<HelpButton />
			<BackButton />
			<QuestionnaireForm
				questions={questions}
				answers={answers}
				setAnswers={setAnswers}
			/>
		</div>
	);
};

export default Questionnaire;