import React, { useEffect, useState } from "react";
import Progress from "../../../../components/progress/Progress";
import style from "./LevelUpCharacter.module.scss";
function LevelUpCharacter(props) {
  const {character, progress} = props;
  const [type, setType] = useState();
  const [level, setLevel] = useState();
  useEffect(() => {
    if(character.level < 3) {
      setType('common');
    }
    else {
      setType(character.type);
    }
    setLevel(character.level);
  }, [character])
  return (
    <div className={style.characterWrap}>
      <figure className={style.characterInner}>
        <img src={`/assets/img/character/${type}/${type}_${level}.svg`} alt="キャラクター" width="230" height="210"/>
      </figure>
      <div className={style.levelInfo}>
        <div className={style.level}>{character.level}</div>
        <Progress value={progress} barColor={'rgb(112, 209, 209)'} backGroundColor={'rgb(205, 233, 185)'}/>
      </div>
    </div>
  );
}
export default LevelUpCharacter