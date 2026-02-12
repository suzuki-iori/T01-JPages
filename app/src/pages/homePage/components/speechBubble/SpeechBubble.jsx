import style from './SpeechBubble.module.scss';
function SpeechBubble(props) {
  const {num, isMine} = props;
  return (
    <div className={`${style.speechBubble} ${isMine ? style.mine : ''}`}>{num}</div>
  );
}

export default SpeechBubble;