import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/header/Header";
import LevelUpCharacter from "./components/levelUpCharacter/LevelUpCharacter"
import Items from "./components/Items/Items";
import Navigation from "../../components/navigation/Navigation";
import style from "./LevelUpPage.module.scss";
import { AppContext } from "../../context/AppContextProvider";
import Ajax from "../../lib/Ajax";

function LevelUpPage() {
  // data
  const [character, setCharacter] = useState({});
  const [progress, setProgress] = useState(0);

  // useContext
  const {
    setAppState,
    setLoginToken,
    setLoading,
    activeTeam,
    setLoginTeamId,
    setToast
  } = useContext(AppContext);

  /**
   * キャラクター情報を取得する
   */
  const characterGet = () => {
    setLoading(true);
    Ajax(null, `character/${activeTeam.id}`)
    .then((data) => {
      if(data.status === 'failure') {
        // 失敗
        setToast({toast: true, state: 'levelup', message: 'エラーが発生しました。もう一度お試しください。'})
      }
      else {
        // キャラクター情報
        setCharacter(data.character);
        // バーの長さを取得
        setProgress(calculateProgress(data.character.point));
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("キャラクターの取得に失敗しました", error);
      setAppState('visitorLogin');
      setLoginToken('');
      setLoginTeamId('');
      setLoading(false);
    });
  }

  // レベル境界値（バックエンドと同じ）
  const levelBorder = [13000, 8000, 4000, 2000, 600];

  /**
   * 現在のポイントからポイントバーの長さを取得する
   * @param point 現在のポイント
   * @returns ポイントバーの長さ
   */
  const calculateProgress = (point) => { // returnはprogressのwidth
    if (point >= levelBorder[0]) {
      return 100;
    }
    else if (point >= levelBorder[1]) {
      return ((point - levelBorder[1]) / (levelBorder[0] - levelBorder[1])) * 100;
    }
    else if (point >= levelBorder[2]) {
      return ((point - levelBorder[2]) / (levelBorder[1] - levelBorder[2])) * 100;
    }
    else if (point >= levelBorder[3]) {
      return ((point - levelBorder[3]) / (levelBorder[2] - levelBorder[3])) * 100;
    }
    else if (point >= levelBorder[4]) {
      return ((point - levelBorder[4]) / (levelBorder[3] - levelBorder[4])) * 100;
    }
    return (point / levelBorder[4]) * 100;
  };

  // useEffect
  useEffect(() => {
    characterGet();
  },[]);

  return (
    <>
      <Header/>
      <section id="level-up" className={style.levelUp}>
        <LevelUpCharacter character={character} progress={progress}/>
        <Items characterGet={characterGet}/>
      </section>
      <Navigation/>
    </>
  );
}

export default LevelUpPage