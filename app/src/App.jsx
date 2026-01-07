import './App.scss';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContextProvider';
import StudentLogin from './components/page/studentLogin/StudentLogin';
import ScanBusinessCardMobile from './components/page/scanBusinessCard-phone/ScanBusinessCard';
import HomePage from './components/page/homePage/HomePage';
import RankingPage from './components/page/rankingPage/RankingPage';
import ReviewPage from './components/page/reviewPage/ReviewPage';
import GetReviewsPage from './components/page/getReviewsPage/GetReviewsPage';
import LevelUpPage from './components/page/levelUpPage/LevelUpPage';
import ProfilePage from './components/page/profilePage/ProfilePage';
import Questionnaire from './components/page/questionnaire/Questionnaire';
import TeamTop from './components/page/teamTop/TeamTop';
import Loading from './components/organisms/loading/Loading';
import HelpModal from './components/molecules/heplModal/HelpModal';
import Toast from './components/atoms/toast/Toast';

function App() {
  // data
  const [backGroudColor, setBackGroudColor] = useState('F7F2DF'); // F7F2DF CDE9B9
  
  // context
  const {
    appState,
    setAppState,
    loginToken,
    loginType,
    loading,
    toast,
    helpModalIsOpen
  } = useContext(AppContext);
  
  //ログインハンドリング 
  useEffect(() => {
    // 学生でログイン、未ログイン
    // 来場者でログイン、未ログイン
    
    // ログイン中ならhomeへ
    if(loginToken && loginToken !== '') {
      setAppState('home');
    }
    else {
      // 未ログイン学生
      let url = new URL(window.location.href);
      let params = url.searchParams;
      if((loginType === 'student') ||  params.get('login') === 'student')  {
        setAppState('studentLogin');
      }
      else {
        setAppState('visitorLogin');
      }
    }


    
  }, [loginToken]);

  useEffect(() => {
    // 背景色の変更
    switch (appState) {
      case 'studentLogin' :
      case 'review' :
      case 'profile' :
      case 'question' :
        setBackGroudColor('F7F2DF');
        break;
      case 'home' :
      case 'ranking' :
      case 'teamTop' :
      case 'getReview' :
      case 'levelup' :
        setBackGroudColor('CDE9B9');
        break;
      default:
    }
  }, [appState])


  return (
    <div className='appBackground' style={{background: `#${backGroudColor}`}}>
      {(toast.toast) && <Toast/>}
      {(appState === 'studentLogin') && <StudentLogin/ >}
      {(appState === 'visitorLogin') && <ScanBusinessCardMobile/ >}
      {(appState === 'home') && <HomePage/ >}
      {(appState === 'ranking') && <RankingPage/ >}
      {(appState === 'review') && <ReviewPage/ >}
      {(appState === 'teamTop') && <TeamTop/ >}
      {(appState === 'getReview') && <GetReviewsPage/ >}
      {(appState === 'levelup') && <LevelUpPage/ >}
      {(appState === 'profile') && <ProfilePage/ >}
      {(appState === 'question') && <Questionnaire/ >}
      {helpModalIsOpen && <HelpModal />}
      {loading && <Loading />}
    </div>
  );
}

export default App;
