import React, { useEffect, useState, useContext } from "react";
import Ajax from "../../../lib/Ajax";
import styles from "./teamTop.module.css";
import Header from "../../components/header/Header";
import Navigation from "../../components/navigation/Navigation";
import CharacterStatus from "../../molecules/characterstatus/CharacterStatus";
import { AppContext } from "../../../context/AppContextProvider";

const TeamTop = () => {
	// data
	const [character, setCharacter] = useState(null);
	const [count, setCount] = useState(0);
	// context
	const {
		setAppState,
		setLoginToken,
		setLoginTeamId,
		setLoading,
		activeTeam,
		setToast
	} = useContext(AppContext);

	// チームトップ情報取得
	useEffect(() => {
		setLoading(true);
		Ajax(null, `team/top/${activeTeam.id}`)
		.then((data) => {
			if (data.status === 'failure') {
				setToast({toast: true, state: 'teamTop', message: 'エラーが発生しました。'})
			} else {
				let characterData = data.team.characterInfo;
				if(characterData.level < 3) {
					characterData.type = 'common';
				}
				setCharacter(characterData);
				setCount(data.team.count);
			}
			setLoading(false);
		})
		.catch((error) => {
			console.error("チーム情報の取得に失敗しました", error);
			setAppState('visitorLogin');
			setLoginToken('');
			setLoginTeamId('');
			setLoading(false);
		});
	}, [activeTeam]);

	return (
		<>
			<Header/>
			<section className={styles.container}>
				{character && (
					<>
						<CharacterStatus character={character} count={count}/>
						<figure className={styles.character}>
							<img src={`/assets/img/character/${character.type}/${character.type}_${character.level}.svg`} alt={`${character.type}のレベル${character.level}のキャラクター`} />
						</figure>
					</>
				)}
				<div className={styles.space}></div>
			</section>
			<Navigation />
		</>
	);
};

export default TeamTop;
