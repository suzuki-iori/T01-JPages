import styles from './ReviewForm.module.scss'
import InputField from '../inputField/InputField.jsx';
import Comment from '../comment/Comment.jsx';

function ReviewForm(props) {
	const {
		planValue, setPlanValue,
		designValue, setDesignValue,
		skillValue, setSkillValue,
		presentValue, setPresentValue,
		positiveValue, setPositiveValue,
		negativetValue, setNegativeValue,
		otherValue, setOtherValue,
		openDialog
	} = props;
    

	return (
		<form className={styles.formReview} onSubmit={openDialog}>
			<InputField category="plan" kana="企画" data={planValue} seter={setPlanValue}/>
			<InputField category="design" kana="デザイン" data={designValue} seter={setDesignValue}/>
			<InputField category="skill" kana="技術" data={skillValue} seter={setSkillValue}/>
			<InputField category="present" kana="プレゼン" data={presentValue} seter={setPresentValue}/>
			<dl className='commentWrap'>
				<Comment question="良い点はありますか？" category="positive"data={positiveValue} seter={setPositiveValue}/>
				<Comment question="改善点はありますか？" category="negative" data={negativetValue} seter={setNegativeValue}/>
				<Comment question="その他何かあれば教えてください。" category="other" data={otherValue} seter={setOtherValue}/>
			</dl>
			<button className={styles.submit} type="submit">投稿する</button>
			<div className={styles.space}></div>
		</form>
	);
}

export default ReviewForm;