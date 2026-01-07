import Styles from './backButton.module.css'
import { AppContext } from '../../../context/AppContextProvider';
import { useContext } from 'react';

function BackButton() {
	const {setAppState} = useContext(AppContext);
	return (
		<button type='button' className={Styles.backButton} onClick={() => setAppState('home')}>戻る</button>
	)
}

export default BackButton;