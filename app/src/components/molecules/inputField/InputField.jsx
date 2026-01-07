import React, { useEffect, useState } from 'react';
import styles from './InputField.module.scss'
import InputRange from '../../atoms/inputRange/InputRange.jsx';

function InputField(props) {
	const {category, kana, data, seter} = props;
	// data
  const [speechBubblePosition, setSpeechBubblePosition] = useState(70);
	const [isSliding, setIsSliding] = useState(false);

	// method
	const handleMouseDown = () => {
    setIsSliding(true);
  };

  const handleMouseUp = () => {
    setIsSliding(false);
  };

	const handleTouchStart = () => {
    setIsSliding(true);

  };

  const handleTouchEnd = () => {
    setIsSliding(false);
	};

	// useEffect
	useEffect(() => {
    if (data) {
        let position = 0;
				const numericData = Number(data);
        switch (numericData) {
					case 0:
						position = 7;
						break;
					case 10:
						position = 15;
						break;
					case 20:
						position = 25;
						break;
					case 30:
						position = 33;
						break;
					case 40:
						position = 41;
						break;
					case 50:
						position = 50;
						break;
					case 60:
						position = 59;
						break;
					case 70:
						position = 67;
						break;
					case 80:
						position = 76;
						break;
					case 90:
						position = 85;
						break;
					case 100:
						position = 93;
						break;
					default:
						position = 0; // or set a default position if needed
						break;
        }

        setSpeechBubblePosition(position);
			}
	}, [data]);
	
	return (
		<div className={styles.inputField}>
			<label className={category} htmlFor={category}><span className={styles.labelItem}>{category}</span> - {kana}</label>
			<div className={styles.valueWrap}>
				{isSliding &&  <div className={styles.speechBubble} style={{left: `${speechBubblePosition}%`}}>{data}</div>}
				<span className={styles.value}></span>
			</div>
			<InputRange 
				category={category} data={data} seter={seter}
				handleMouseDown={handleMouseDown}
				handleMouseUp={handleMouseUp}
				handleTouchStart={handleTouchStart}
				handleTouchEnd={handleTouchEnd}
				/>
		</div>
	);
}

export default InputField;