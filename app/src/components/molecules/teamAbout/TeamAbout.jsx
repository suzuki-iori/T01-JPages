import Styles from './teamAbout.module.css'

const TeamAbout = ({ name, description }) => {
	return (
		<div className={Styles.container}>  
			<h2 className={Styles.name}>{name ? name : '未設定' }</h2>
			<p className={Styles.description}>{description ? description : 'このチームの説明は入力されていません'} </p>
		</div>
	)
}
export default TeamAbout;