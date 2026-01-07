import { useState, useEffect, useContext } from "react";
import Styles from "./teamProfile.module.css";
import Ajax from "../../../lib/Ajax";
import Header from "../../organisms/header/Header";
import Navigation from "../../organisms/navigation/Navigation";
import Character from "../../atoms/character/Character";
import RaderChart from "../../atoms/raderChart/RaderChart";
import TeamAbout from "../../molecules/teamAbout/TeamAbout";
import TeamStudents from "../../molecules/teamStudents/TeamStudents";
import EditButton from "../../atoms/editButton/EditButton";
import Modal from "../../organisms/modal/Modal";
import { AppContext } from "../../AppContextProvider";

const TeamProfile = () => {
	//  console.log('-------------------------------');
	//  console.log('TeamProfile');
	const [parameter, setParameter] = useState(null);
	const [team, setTeam] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {loginType, loginTeamId, activeTeam} = useContext(AppContext);

	useEffect(() => {
		// チーム情報を取得
		Ajax(null, `team/${activeTeam}`)
		.then((teamData) => {
			if(data.status === 'failure') {
				// 失敗
				setToast({toast: true, state: 'profile', message: 'エラーが発生しました。'})
			}
			else {
				setTeam(teamData.team);
				setParameter(teamData.team.parameters);
			}
				//  console.log("teamData : ", teamData);
		})
		.catch((error) => {
				// console.error("チーム情報を取得できませんでした : ", error);
		})
	}, [])

	const handleEditClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSave = (updatedTeam) => {
		setTeam(updatedTeam);
		setParameter(updatedTeam.parameters)
	};

	return (
		<>
			<Header/>
				<div className={Styles.container}>
					{loginType === 'student' && activeTeam === loginTeamId && (
							<EditButton handleEditClick={handleEditClick}/>
					)}      
					<div className={Styles.teamStatus}>
						<div className={Styles.characterContainer}>
							<Character />
						</div>
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
			<Modal 
					isOpen={isModalOpen}
					handleCloseModal={handleCloseModal}
					team={team}
					parameter={parameter}
					onSave={handleSave}
			/>
		</>
	)
}   

export default TeamProfile;