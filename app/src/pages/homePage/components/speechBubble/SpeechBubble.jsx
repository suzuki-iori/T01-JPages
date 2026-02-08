import style from './SpeechBubble.module.scss';
function SpeechBubble(props) {
  const {num} = props;
  return (
    <div className={style.speechBubble}>{num}</div>
  );
}

export default SpeechBubble;