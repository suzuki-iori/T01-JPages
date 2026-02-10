import SubmitButton from "../../../../components/submitbutton/SubmitButton";
import TextInput from "../textinput/TextInput";
import NumberInput from "../numberinput/NumberInput"
import styles from "./questionnaireForm.module.css"

function QuestionnaireForm({handleSubmit, questions, handleAnswerChange, answers, errorMessage}) {
	return (
		<>
			<form className={styles["questionnaire-form"]} onSubmit={handleSubmit}>
				{errorMessage && (
					<div className={styles["error-banner"]}>
						<span className={styles["error-icon"]}>⚠️</span>
						<p className={styles["error-text"]}>{errorMessage}</p>
					</div>
				)}
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
				<SubmitButton visualType={"submit"}/>
			</form>
		</>
	)
}
export default QuestionnaireForm;