import SubmitButton from "../../../../components-old/atoms/submitbutton/SubmitButton";
import TextInput from "../textinput/TextInput";
import NumberInput from "../numberinput/NumberInput"
import styles from "./questionnaireForm.module.css"

function QuestionnaireForm({handleSubmit, questions, handleAnswerChange, answers}) {
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
				<SubmitButton visualType={"submit"}/>
			</form>
		</>
	)
}
export default QuestionnaireForm;