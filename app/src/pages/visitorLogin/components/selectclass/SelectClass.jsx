import React, { useState, useRef, useEffect } from "react";
import styles from "./selectClass.module.css";

const OPTIONS = [
	{ value: '1', label: '企業の方' },
	{ value: '2', label: '教職員' },
	{ value: '3', label: '日本電子専門学校生' },
	{ value: '4', label: '卒業生' },
	{ value: '5', label: 'その他の方' },
];

const SelectClass = ({ visitorType, setVisitorType, setErrorMessage, loading }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const selectedOption = OPTIONS.find(opt => opt.value === visitorType);
	const displayText = selectedOption ? selectedOption.label : '来場者区分';

	// 外側クリックで閉じる
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (value) => {
		setVisitorType(value);
		setIsOpen(false);
		if (value !== '0') {
			setErrorMessage('');
		}
	};

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<button
				type="button"
				className={`${styles.trigger} ${visitorType === '0' ? styles.placeholder : ''}`}
				onClick={() => setIsOpen(!isOpen)}
				disabled={loading}
			>
				{displayText}
				<span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
			</button>

			{isOpen && (
				<ul className={styles.menu}>
					{OPTIONS.map((option) => (
						<li
							key={option.value}
							className={`${styles.option} ${visitorType === option.value ? styles.selected : ''}`}
							onClick={() => handleSelect(option.value)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SelectClass;