import React, { useContext, useEffect, useState } from "react";
import style from "./Character.module.scss";
import { AppContext } from "../../context/AppContextProvider";
function Character(props) {
  // context
  const {
    setAppState,
    activeTeam,
    setActiveTeam
  } = useContext(AppContext);
  const {id = activeTeam.id, num = activeTeam.num, data} = props;

  const [type, setType] = useState();
  const [level, setLevel] = useState();
  useEffect(() => {
    if(data.level < 3) {
      setType('common');
    }
    else {
      setType(data.type);
    }
    setLevel(data.level);
  }, [data])
 
  // クリックされたらリダイレクト
  const handleClick = () => {
    setAppState('teamTop');
    setActiveTeam({id, num})
  }

  return (
    <figure className={style.characterInner} onClick={handleClick}>
      <img src={`/assets/img/character/${type}/${type}_${level}.svg`} alt={`${type}のレベル${level}のキャラクター`} />
    </figure>
  );
}

export default Character;