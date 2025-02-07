import React from 'react';
import CardIcon from '../../../assets/cardicon/cardIcon';
import ListIcon from '../../../assets/listicon/listIcon';
import styles from './TeamButton.module.css';

const TeamButton = ({ visualType, onClick, isInactive }) => {
  const Icon = visualType === 'list' ? ListIcon : CardIcon;
  return (
    <button onClick={onClick} className={styles.teamButton}>
      <Icon isActive={!isInactive} />
    </button>
  );
};

export default TeamButton;
