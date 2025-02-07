import React from 'react';
import Styles from './editButton.module.css';

const EditButton = ({ handleEditClick }) => {
	return (<button onClick={handleEditClick} className={Styles.button}>編集</button>);
};

export default EditButton;