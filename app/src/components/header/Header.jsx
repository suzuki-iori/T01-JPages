import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider';
import styles from './Header.module.scss';
import  HelpButton  from '../../components-old/atoms/helpButton/HelpButton';

function Header() {
	const {
		appState,
		setAppState,
		activeTeam,
		grade,
	} = useContext(AppContext);


	//ページごとの設定
	const pageInfo = {
		'home' : {
			'color': 'headerGreen',
			'title' : grade === 3 ? '卒業制作' : '進級制作' ,
			'isShow' : false
		},
		'ranking' : {
			'color': 'headerGreen',
			'title' : 'ランキング',
			'isShow' : false
		},
		'teamTop' : {
			'color': 'headerGreen',
			'title' : 'チームトップ',
			'isShow' : true
		},
		'profile' : {
			'color': 'headerBeige',
			'title' : 'プロフィール',
			'isShow' : true
		},
		'review' : {
			'color': 'headerBeige',
			'title' : '評価',
			'isShow' : true
		},
		'getReview' : {
			'color': 'headerGreen',
			'title' : 'くちこみ',
			'isShow' : true
		},
		'levelup' : {
			'color': 'headerGreen',
			'title' : 'レベルアップ',
			'isShow' : true
		}
	}
	return (
		<header className={styles[pageInfo[appState].color]}> 
			<h1 className={styles.logo}><div className={styles.logoImg} onClick={() => setAppState('home')}>
				<img src={`/assets/img/home_${grade}jz_active.svg`} alt={activeTeam.num + 'トップ'}  />
			</div></h1>
			<h2>
				{pageInfo[appState].isShow && <span className={styles.number} onClick={() => setAppState('teamTop')}>{activeTeam.num}</span>}
				<p className={styles.title}>{pageInfo[appState].title}</p>
			</h2>
			<HelpButton />
		</header> 
	);
}

export default Header;