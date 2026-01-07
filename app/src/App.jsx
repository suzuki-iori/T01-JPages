import './App.scss';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContextProvider';
import StudentLogin from './pages/studentLogin/StudentLogin';
import VisitorLogin from './pages/visitorLogin/VisitorLogin';
import HomePage from './pages/homePage/HomePage';
import RankingPage from './pages/rankingPage/RankingPage';
import ReviewPage from './pages/reviewPage/ReviewPage';
import GetReviewsPage from './pages/getReviewsPage/GetReviewsPage';
import LevelUpPage from './pages/levelUpPage/LevelUpPage';
import ProfilePage from './pages/profilePage/ProfilePage';
import Questionnaire from './pages/questionnaire/Questionnaire';
import TeamTop from './pages/teamTop/TeamTop';
import Loading from './components/loading/Loading';
import HelpModal from './components-old/molecules/heplModal/HelpModal';
import Toast from './components-old/atoms/toast/Toast';

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
    // if(loginToken && loginToken !== '') {
    //   setAppState('home');
    // }
    // else {
    //   // 未ログイン学生
    //   let url = new URL(window.location.href);
    //   let params = url.searchParams;
    //   if((loginType === 'student') ||  params.get('login') === 'student')  {
    //     setAppState('studentLogin');
    //   }
    //   else {
    //     setAppState('visitorLogin');
    //   }
    // }


    
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
      {(appState === 'visitorLogin') && <VisitorLogin/ >}
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
