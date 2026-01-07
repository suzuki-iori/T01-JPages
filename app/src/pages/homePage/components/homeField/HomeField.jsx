import React, {useEffect, useState, useContext} from 'react';
import styles from './HomeField.module.scss';
import SpeechBubble from '../../../../components-old/atoms/speechBubble/SpeechBubble.jsx';
import Character from '../../../../components/character/Character.jsx';
import { AppContext } from "../../../../context/AppContextProvider.jsx";
import Ajax from "../../../../lib/Ajax.js";
import filterData from '../../../../lib/filterData.js';


function HomeField() {
  // data
  // const homeHeight = (window.innerHeight - 220); // heder80px 画面に余裕を持たせる20px
  // const homeWidth = (window.innerWidth);
  // const imgHeight = 160;
  // const imgWidth = 100;
  // const  [positions, setPositions] = useState([]); 
  const [getCharacter, setGetCharacter] = useState([]);
  const [showCharacters, setShowCharacters] = useState([]);
  // context
  const {
    setAppState,
    setLoginToken,
    setLoginTeamId,
    setLoading,
    loginToken,
    loginType,
    grade,
    setToast
  } = useContext(AppContext);

  // チーム一覧取得
  useEffect(() => {
    setLoading(true);
    Ajax(null, `showTeam/app`)
    .then((data) => {
      if(data.status === 'failure') {
        // 失敗
        setToast({toast: true, state: 'home', message: 'エラーが発生しました。'})
      }
      else if(data.status === 'TokenError') {
        // 失敗
        setToast({toast: true, state: 'visitorLogin', message: '認証エラーです。もう一度ログインしてください。'})
      }
      else {
        setGetCharacter(filterData(data.team));
        filterCharacters(filterData(data.team))
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("チーム一覧が取得できませんでした", error);
      setAppState('visitorLogin');
      setLoginToken('');
      setLoginTeamId('');
      setLoading(false);
    });
  }, [loginType]);

  // 進級制作と卒業制作切り替えるメソッド
  const filterCharacters = (data = [...getCharacter]) => {
    let newCharacters = data;
    newCharacters = newCharacters.filter((e) => {
      return e.grade === grade;
    });
    setShowCharacters(newCharacters);
  }

  // 進級制作と卒業制作切り替え
  useEffect(() => {
    filterCharacters();
  }, [grade])

  //ランダムな位置に表示する
  // useEffect(() => {
  //   const newPositions = [];
  //   showCharacters.forEach((e, index) => {
  //     let isLoop = true;
  //     let randomTop;
  //     let randomLeft;
  //     let loopCount = 0;
  //     while (isLoop) {
  //       randomTop = Math.floor(Math.random() * (homeHeight - imgHeight));
  //       randomLeft = Math.floor(Math.random() * (homeWidth - imgWidth));
  //       isLoop = newPositions.some((elm) => Math.abs(randomTop - elm.top) <= 90 && Math.abs(randomLeft - elm.left) <= 90);
  //       if(++loopCount > 20) {
  //         // 無限ループを解除するためにこのuseEffectをやり直す
  //         loopCount = 0;
  //         setShowCharacters(showCharacters);
  //       }
  //     }
  //     newPositions[index] = {top:randomTop, left:randomLeft};
  //   });
  //   setPositions(newPositions);
  // }, [showCharacters])

  return (
    <div className={styles.homeField} >
      {showCharacters.length > 0 && 
      <ul className={styles.teamGroup}>  
        {showCharacters.map((data, index) => (
          <li
            key={index}
            id={`image-${index}`}
            // style={{
            // position: "absolute",
            // top: positions[index]?.top || 0,
            // left: positions[index]?.left || 0,
            // }}
          >
            <SpeechBubble num={data.num}/>
            <Character id={data.id} num={data.num} data={data.character}/>
          </li>
        ))}
      </ul>}
			<div className={styles.space}></div>
    </div>
  );
}

export default HomeField;