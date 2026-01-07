import styles from './Hamburger3.module.scss';

function Hamburger3({onActivate, isActive}) {
	const toggleActive = () => {
		onActivate(!isActive);
	};

	return (
	<div className={`${styles.plate} ${isActive ? styles.active : ''}`} onClick={toggleActive}>
		<svg className={styles.burger} version="1.1" height="100" width="100" viewBox="0 0 100 100">
			<path className={`${styles.line} ${styles.line1}`} d="M 50,35 H 30 C 6.9919512,35 5.5084746,123.72881 5.5084746,123.72881" />
			<path className={`${styles.line} ${styles.line2}`} d="M 50,35 H 70 C 98.006349,35 92.796611,119.91525 92.796611,119.91525" />
			<path className={`${styles.line} ${styles.line3}`} d="M 50,50 H 30 C 8.2796577,50 5.9322035,138.1356 5.9322035,138.1356" />
			<path className={`${styles.line} ${styles.line4}`} d="M 50,50 H 70 C 91.152643,50 91.949152,133.21754 91.949152,133.21754" />
			<path className={`${styles.line} ${styles.line5}`} d="M 50,65 C 50,65 47.570314,65 30,65 C 4.9857853,65 9.3220337,147.88136 9.3220337,147.88136" />
			<path className={`${styles.line} ${styles.line6}`} d="M 50,65 H 70 C 91.937316,65 88.559322,144.91525 88.559322,144.91525" />
		</svg>
		<svg className={styles.x} version="1.1" height="100" width="100" viewBox="0 0 100 100">
			<path className={styles.line} d="M 38,36 L 62,62" />
			<path className={styles.line} d="M 62,36 L 38,62" />
		</svg>
	</div>
	);
}

export default Hamburger3;
