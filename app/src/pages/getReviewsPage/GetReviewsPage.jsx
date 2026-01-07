import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../context/AppContextProvider';
import styles from './GetReviewsPage.module.scss'
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import GetReviewField from './components/getReviewField/GetReviewField';
import Ajax from '../../../lib/Ajax'
import PointGraph from '../../molecules/pointGraph/PointGraph';

function GetReviewsPage() {
  // context
  const {
    setAppState,
    setLoginToken,
    setLoading,
    activeTeam,
    setLoginTeamId,
    setToast
  } = useContext(AppContext);

  // data
  // const [activeItem, setActiveItem] = useState('total');
  const [getReviewData, setGetReviewData] = useState([]); //くちこみ全データ

  	//編集済み表示データ
	const [GetReviewEditData, setGetReviewEditData] = useState([]);

  // 
  useEffect(() => {
    setLoading(true);
    Ajax(null, `rating/${activeTeam.id}`)
      .then((data) => {
        if(data.status === 'failure') {
          // 失敗
          setToast({toast: true, state: 'getReview', message: 'エラーが発生しました。もう一度お試しください。'})
        }
        else {
          setGetReviewData(data.rating);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("レビューの読み込みに失敗しました。", error);
        setAppState('visitorLogin');
        setLoginToken('');
        setLoginTeamId('');
        setLoading(false);
      });
    },[])
    
  return (
    <>
    <Header/>
    <section>
      {getReviewData && <PointGraph getReviewData={GetReviewEditData}/>}
      <div className={styles.scrol}>
        {getReviewData && <GetReviewField getReviewData={getReviewData} GetReviewEditData={GetReviewEditData} setGetReviewEditData={setGetReviewEditData}/>}
      </div>
    </section>
    <Navigation/>
    </>
  );
}

export default GetReviewsPage;