import { useState } from "react";
import styles from "./textInput.module.css"

function TextInput({question, handleAnswerChange}) {
	const [valueError, setValueError] = useState('');

	const handleChange = (e) => {
		const value = e.target.value;

		handleAnswerChange(question.id, value);

		if (value.length > 255) {
			setValueError('回答は255文字以内で入力してください')
		} else {
			setValueError('');
		}
	}

	const handleBlur = (e) => {
		const value = e.target.value;
		if (!value) {
			setValueError('必須の質問です');
		} else if (value.length > 255) {
			setValueError('回答は255文字以内で入力してください')
		} else {
			setValueError('');
		}
	}

	return (
		<>
			<textarea
			rows="3"
			className={styles["answer-input"]}
			name={`answer-${question.id}`}
			onChange={handleChange}
			onBlur={handleBlur}
			/>
			{valueError && <p className={styles.valueError}>{valueError}</p>}
		</>
	)
}

export default TextInput;