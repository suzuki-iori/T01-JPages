import styles from "./DeleteButton.module.css";

export const DeleteButton = ({onClick}) => {
  console.log(onClick);
    return (
    <button onClick={onClick} className={styles.delete}>
      削除
    </button>
    )
  }
  