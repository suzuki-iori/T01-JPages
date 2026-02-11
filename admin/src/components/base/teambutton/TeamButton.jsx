import React from 'react';
import PropTypes from 'prop-types';
import CardIcon from '../../../assets/cardicon/cardIcon';
import ListIcon from '../../../assets/listicon/listIcon';
import styles from './TeamButton.module.css';

const ICON_MAP = {
  list: ListIcon,
  card: CardIcon,
};

/**
 * 表示切り替えボタンコンポーネント
 * @param {Object} props
 * @param {'list' | 'card'} props.visualType - 表示タイプ
 * @param {Function} props.onClick - クリックハンドラ
 * @param {boolean} props.isActive - アクティブ状態
 */
const TeamButton = ({ visualType, onClick, isActive = false }) => {
  const Icon = ICON_MAP[visualType] || CardIcon;

  return (
    <button
      onClick={onClick}
      className={`${styles.teamButton} ${isActive ? styles.active : ''}`}
      aria-pressed={isActive}
      aria-label={`${visualType}表示に切り替え`}
    >
      <Icon isActive={isActive} />
    </button>
  );
};

TeamButton.propTypes = {
  visualType: PropTypes.oneOf(['list', 'card']).isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

export default TeamButton;
