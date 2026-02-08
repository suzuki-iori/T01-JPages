import styles from "./DeleteButton.module.css";

export const DeleteButton = ({onClick}) => {
    return (
    <button onClick={onClick} className={styles.delete}>
      削除
    </button>
    )
  }
  