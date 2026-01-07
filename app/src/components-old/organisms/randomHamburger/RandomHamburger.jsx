import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContextProvider';
import Hamburger1 from '../../atoms/hamburger_1/Hamburger1';
import Hamburger2 from '../../atoms/hamburger_2/Hamburger2';
import Hamburger3 from '../../atoms/hamburger_3/Hamburger3';
import Hamburger4 from '../../atoms/hamburger_4/Hamburger4';
import Hamburger5 from '../../atoms/hamburger_5/Hamburger5';
import Hamburger6 from '../../atoms/hamburger_6/Hamburger6';
import styles from './RandomHamburger.module.scss';

// ハンバーガーを取得
const hamburgers = [Hamburger1, Hamburger2, Hamburger3, Hamburger4, Hamburger5, Hamburger6];

function RandomHamburger() {
	// data
	const [isActive, setIsActive] = useState(false);
	const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * hamburgers.length))
	const RandomComponent = hamburgers[randomIndex];

	// context
	const {
		appState,
		setAppState,
		loginType,
		grade,
		setGrade,
		isPosted
	} = useContext(AppContext);

	// 押されたらハンバーガをランダムに変更
	const handleActivate = (active) => {
		setIsActive(active);
		if(!active) {
			setTimeout(() => {
				setRandomIndex(Math.floor(Math.random() * hamburgers.length));
			}, 500);
		}
	}

	return (
		<>
			<RandomComponent onActivate={handleActivate} isActive={isActive}/>
			<ul className={`${styles.activeMenu} ${isActive ? styles.active : ''}`}>
				<li className={`${styles.menu} ${styles.menu1}`} onClick={() => {setGrade(grade === 3 ? 2 : 3); setIsActive(false) }}>
					<figure><img src={`/assets/img/home_${grade === 3 ? 2 : 3}jz.svg`} style={{width: '50%'}} alt="home" /></figure>
					<figcaption>{grade === 3 ? '進級制作' : '卒業制作'}</figcaption>
				</li>
				<li className={`${styles.menu} ${styles.menu2}`} onClick={() => setAppState('ranking')}>
					<figure><img src={`/assets/img/ranking${appState === 'ranking' ? '_active' : ''}.svg`} style={{width: '32%'}} alt="ranking" /></figure>
					<figcaption>ランキング</figcaption>
				</li>
				{(loginType === 'visitor' && !isPosted) && <li className={`${styles.menu} ${styles.menu3}`} onClick={() => setAppState('question')}>
					<figure><img src={`/assets/img/go_home.svg`} alt="question" /></figure>
					<figcaption>帰る</figcaption>
				</li>}
			</ul>
		</>
	);
}

export default RandomHamburger;
