import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../../context/AppContextProvider';
import styles from './Ranking.module.scss';
import SwitchTag from '../../../../components-old/molecules/switchTag/SwitchTag';
import RankTop3 from '../rankTop3/RankTop3';
import RankTeamField from '../../../../components-old/molecules/rankTeamField/RankTeamField';
import Ajax from '../../../../lib/Ajax'
import filterData from '../../../../lib/filterData';

function Ranking() {
  // context
  const {
    setAppState,
    setLoginToken,
    setLoading,
    setActiveTeam,
    setLoginTeamId,
    grade,
    setToast
  } = useContext(AppContext);

  // data
  const [activeItem, setActiveItem] = useState('total');
  const [ranking, setRanking] = useState([]); //ランキング全データ
  const [showRanking, setShowRanking] = useState([]);//表示するランキングデータ
  const [rankingData, setRankingData] = useState([]); //ランキング4位以下
  const [topRankingData, setTopRankingData] = useState([]); //ランキング1位～3位

  // ランキングデータの取得
  useEffect(() => {
    setLoading(true);
    Ajax(/*年度ごと*/null, 'ranking')
      .then((data) => {
        if(data.status === 'failure') {
          // 失敗
          setToast({toast: true, state: 'ranking', message: 'エラーが発生しました。もう一度お試しください。'})
        }
        else {
          setRanking(filterData(data));
          filterRanking(filterData(data));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("ランキングデータの取得に失敗しました", error);
        setAppState('visitorLogin');
        setLoginToken('');
        setLoginTeamId('');
        setLoading(false);
      });
  },[]);

  // 進級制作と卒業制作切り替えるメソッド
  const filterRanking = (data = [...ranking]) => {
    let newShowRanking = data;
    newShowRanking = newShowRanking.filter((e) => {
      return e.grade === grade;
    });
    setShowRanking(newShowRanking);
  }

  // 進級制作と卒業制作切り替え
  useEffect(() => {
    filterRanking();
  }, [grade])

  // タブを変更するたびソートする
  useEffect(() => {
    let newdata = [...showRanking];
    newdata.sort((a,b) => {
      return b[activeItem] - a[activeItem]
    })
    const newrankingData = [...newdata]
    setRankingData(newrankingData);
    const newTopRankingData = [...newdata];
    setTopRankingData(newTopRankingData.splice(0, 3));
  }, [showRanking, activeItem])

  // クリックされたらレビュー画面にページ遷移する
  const handleClick = (id, num) => {
    setActiveTeam({id, num});
    setAppState('getReview');
  }
    
  return (
    <>
      <SwitchTag setActiveItem={setActiveItem} activeItem={activeItem}/>
      <RankTop3 topRankingData={topRankingData} activeItem={activeItem} handleClick={handleClick}/>
      <div className={styles.content}>
        <ul className={styles.rankingList}>
          {rankingData.map((data, index) => {
            return(
              <li key={'ranking-' + data.id} onClick={()=>handleClick(data.id, data.num)}>
                <p className={styles.no}>{String(index + 1).padStart(2, '0')}</p>
                <RankTeamField rankingData={data} activeItem={activeItem}/>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  );
}

export default Ranking;
