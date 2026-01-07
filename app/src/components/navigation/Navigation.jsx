import React from 'react';
import styles from './Navigation.module.scss';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider';

function Navigation() {
	const {
		appState,
		setAppState,
		loginTeamId,
		activeTeam
	} = useContext(AppContext);

	return (
	<ul className={styles.nav}>
		{
			// 自分のチームならレベルアップ、それ以外ならレビュー
			loginTeamId === activeTeam.id ? 
			<li className="levelUp" onClick={() => setAppState('levelup')}>
				<img src={`/assets/img/level_up${appState === 'levelup' ? '_active' : ''}.svg`} alt="levelUp"/>
				<figcaption>レベルアップ</figcaption>
				</li> :
			<li className="review" onClick={() => setAppState('review')}>
				<img src={`/assets/img/review${appState === 'review' ? '_active' : ''}.svg`} alt="review"/>
				<figcaption>評価</figcaption>
				</li>
		}
		<li className="team-total" onClick={() => setAppState('getReview')}>
			<img src={`/assets/img/get_review${appState === 'getReview' ? '_active' : ''}.svg`} alt="getReview"/>
			<figcaption>くちこみ</figcaption>
			</li>
		<li className="profile" onClick={() => setAppState('profile')}>
			<img src={`/assets/img/profile${appState === 'profile' ? '_active' : ''}.svg`} alt="profile"/>
			<figcaption>プロフィール</figcaption>
			</li>
	</ul>

	);
}

export default Navigation;