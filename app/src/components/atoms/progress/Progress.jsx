import style from './Progress.module.scss'
function Progress(props) {
  let {value, barColor, backGroundColor, borderColor} = props;
  if(!borderColor) {
    borderColor = barColor;
  }
  return (
    <div className={style.barContainer}
    style={{
      background: `linear-gradient(90deg, ${barColor} ${value}%, ${backGroundColor} ${value}%)`,
      border: `3px solid ${borderColor}`
    }}>
  </div>
  )
}
export default Progress;