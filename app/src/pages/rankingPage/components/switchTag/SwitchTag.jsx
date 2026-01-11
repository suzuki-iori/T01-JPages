import React from 'react';
import styles from './SwitchTag.module.scss';

function SwitchTag({setActiveItem, activeItem}) {
	return (
		<div className={styles.switchTagField}>
			<ul className={styles.switchTag}>
				<li className={`${styles.total} ${activeItem === 'total' ? styles.active : ''}`} onClick={() => setActiveItem('total')}>total</li>
				<li className={`${styles.plan} ${activeItem === 'plan' ? styles.active : ''}`} onClick={() => setActiveItem('plan')}>plan</li>
				<li className={`${styles.design} ${activeItem === 'design' ? styles.active : ''}`} onClick={() => setActiveItem('design')}>design</li>
				<li className={`${styles.skill} ${activeItem === 'skill' ? styles.active : ''}`} onClick={() => setActiveItem('skill')}>skill</li>
				<li className={`${styles.present} ${activeItem === 'present' ? styles.active : ''}`} onClick={() => setActiveItem('present')}>present</li>
			</ul>
		</div>
	);
}

export default SwitchTag;