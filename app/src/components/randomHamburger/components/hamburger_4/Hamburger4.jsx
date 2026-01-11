import styles from './Hamburger4.module.scss';

function Hamburger4({onActivate, isActive}) {
	const toggleActive = () => {
		onActivate(!isActive);
	};

	return (
	<div className={`${styles.plate} ${isActive ? styles.active : ''}`} onClick={toggleActive}>
		<svg className={styles.burger} version="1.1" height="100" width="100" viewBox="0 0 100 100">
			<path className={`${styles.line} ${styles.line1}`} d="M 50,35 H 30" />
			<path className={`${styles.line} ${styles.line2}`} d="M 50,35 H 70" />
			<path className={`${styles.line} ${styles.line3}`} d="M 50,50 H 30" />
			<path className={`${styles.line} ${styles.line4}`} d="M 50,50 H 70" />
			<path className={`${styles.line} ${styles.line5}`} d="M 50,65 H 30" />
			<path className={`${styles.line} ${styles.line6}`} d="M 50,65 H 70" />
		</svg>
		<svg className={styles.x} version="1.1" height="100" width="100" viewBox="0 0 100 100">
			<path className={styles.line} d="M 38,36 L 62,62" />
			<path className={styles.line} d="M 62,36 L 38,62" />
		</svg>
	</div>
	);
}

export default Hamburger4;
