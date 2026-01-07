import React from "react";
import Styles from "./camera.module.css";

const Camera = ({videoRef, handleCapture, onNoCardButtonClick}) => {
	return (
		<>
			<div className={Styles["camera"]}>
				<video autoPlay muted playsInline ref={videoRef} className={Styles["video"]} />
				<div className={Styles.frame}></div>
				<p className={Styles.message}>名刺を撮影してください</p>
				<button type='button' className={Styles.noCardButton} onClick={onNoCardButtonClick}>
                手入力
            	</button>
				<button className={Styles["capture-btn"]} onClick={handleCapture}>●</button>
			</div>
		</>
	)
};
export default Camera;