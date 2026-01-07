import React from "react";
import { useState, useEffect, useContext } from "react";
import Styles from "./teamProfile.module.css";
import Ajax from "../../lib/Ajax";
import Header from "../../components/header/Header";
import Navigation from "../../components/navigation/Navigation";
import Character from "../../components/character/Character";
import RaderChart from "../../components-old/atoms/raderChart/RaderChart";
import TeamAbout from "./components/teamAbout/TeamAbout";
import TeamStudents from "./components/teamStudents/TeamStudents";
import EditButton from "./components/editButton/EditButton";
import TeamModal from "./components/teamModal/TeamModal";
import { AppContext } from "../../context/AppContextProvider";

const ProfilePage = () => {
	// data
	const [parameter, setParameter] = useState(null);
	const [team, setTeam] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	// context
	const { setAppState, setLoginToken, loginType,loginTeamId, setLoginTeamId, setLoading, activeTeam, setToast} = useContext(AppContext);

	// チームの情報を取得
	useEffect(() => {
		setLoading(true);
		// チーム情報を取得
		Ajax(null, `team/${activeTeam.id}`)
		.then((data) => {
			if(data.status === 'failure') {
				// 失敗
				setToast({toast: true, state: 'profile', message: 'エラーが発生しました。もう一度お試しください。'})
			} else {
				setTeam(data.team);
				setParameter(data.team.parameters);
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
	}, [])

	// モーダルを開く
	const handleEditClick = () => {
		setIsModalOpen(true);
	};
	// モーダルを閉じる
	const handleCloseModal = () => {
		setIsModalOpen(false);
	};
	// 更新を反映する
	const handleSave = (updatedTeam) => {
		setTeam(updatedTeam);
		setParameter(updatedTeam.parameters)
	};

	return (
		<>
			<Header/>
			<div className={Styles.container}>
				{loginType === 'student' && activeTeam.id === loginTeamId && (
					<EditButton handleEditClick={handleEditClick}/>
				)}      
				<div className={Styles.teamStatus}>
					{team && <div className={Styles.characterContainer}>
						<Character data={team.character}/>
					</div>}
					<div className={Styles.parameterContainer}>
						{parameter && <RaderChart data={parameter}/>}
					</div>
				</div>
				<TeamAbout 
					name={team ? team.name : "チーム名を取得中"}
					description={team ? team.detail : "詳細を取得中"}
				/>
				<TeamStudents 
					students={team ? team.students : "学生情報を取得中"}
				/>
			</div>                
			<Navigation />
			<TeamModal 
				isOpen={isModalOpen}
				handleCloseModal={handleCloseModal}
				team={team}
				parameter={parameter}
				onSave={handleSave}
			/>
		</>
	)
}   

export default ProfilePage;