  import { createContext, useState } from "react";
import useStateStorage from "../hooks/useStateStorage";
export const AppContext = createContext();
function AppContextProvider({children}) {
  
  // Appの状態
  const [appState, setAppState] = useState('visitorLogin'); //studentLogin, visitorLogin, home, ranking, review, teamTop, getReview, profile, levelup, question
  // ログイントークン
  const [loginToken, setLoginToken] = useStateStorage('appToken', '');
  // ログインの種別
  const [loginType, setLoginType] = useStateStorage('type', '');
  // ログインしている学生のチームid
  const [loginTeamId, setLoginTeamId] = useStateStorage('id', '');
 // loading
  const [loading, setLoading] = useState(false);
  // toast
  const [toast, setToast] = useState({toast: false, state: null, message: ''});
  // 現在の閲覧してるチーム
  const [activeTeam, setActiveTeam] = useState({id:null, num:null});
  // 学年
  const [grade, setGrade] = useState(3);
  // アンケート回答
  const [isPosted, setIsPosted] = useStateStorage('isPosted', false);
  // HelpModal
  const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);
  const ctx = {
    appState,
    setAppState,
    loginToken,
    setLoginToken,
    loginType,
    setLoginType,
    loginTeamId,
    setLoginTeamId,
    loading,
    setLoading,
    toast,
    setToast,
    activeTeam,
    setActiveTeam,
    grade,
    setGrade,
    isPosted,
    setIsPosted,
    helpModalIsOpen,
    setHelpModalIsOpen
  }
  return (
    <AppContext.Provider value={ctx}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;
