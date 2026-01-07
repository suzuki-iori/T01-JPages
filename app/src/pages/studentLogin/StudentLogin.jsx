import React, { useState, useContext } from 'react';
import Ajax from '../../../lib/Ajax';
import Styles from './studentLogin.module.css'
import LoginInput from './components/logininput/LoginInput';
import SubmitButton from '../../components/submitbutton/SubmitButton';
import HelpButton from '../../components/helpButton/HelpButton';
import { AppContext } from '../../../context/AppContextProvider';

const StudentLogin = () => {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // context
  const {setLoginToken, setLoginType, setLoginTeamId, setLoading, setToast} = useContext(AppContext);

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value.length > 256) {
      setErrorMessage('学籍番号は256文字以内で入力してください');
    } else {
      setErrorMessage(''); 
    }
    setNumber(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 256) {
      setErrorMessage('名前は256文字以内で入力してください');
    } else {
      setErrorMessage(''); 
    }
    setName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!number || !name) {
      setErrorMessage('学籍番号と名前を入力してください');
      return;
    } else if (number.length > 256 && name.length > 256) {
      setErrorMessage('学籍番号と名前は256文字以内で入力してください')
      return;
    } else if (number.length > 256) {
      setErrorMessage('学籍番号は256文字以内で入力してください！')
      return;
    } else if (name.length > 256) {
      setErrorMessage('名前は256文字以内で入力してください！')
      return;
    }

    setLoading(true);

    const req = { number, name };

    Ajax(null, 'studentlogin', 'POST', req)
    .then((data) => {
      if (data.status === 'failure') {
        setErrorMessage(data.message);
      } else if (data.status === 'ParameterError'){
        setErrorMessage('入力されたパラメーターが違います。');
        setToast({toast: true, state: 'studentLogin', message: 'エラーが発生しました。もう一度お願いします。'})
      } else {
        setLoginToken(data.token);
        setLoginType('student');
        setLoginTeamId(data.team_id);
      }
      setLoading(false);
    }).catch((error) => {
      setErrorMessage('通信エラーが発生しました');
      setLoading(false);
    });
};


  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.loginFormContainer}>
          <h2 className={Styles.title}>ログイン</h2>
          <HelpButton />
          <form onSubmit={handleSubmit}>
            <LoginInput id="number" label="学籍番号" value={number} onChange={handleNumberChange} />
            <LoginInput id="name" label="名前" value={name} onChange={handleNameChange} />
            {errorMessage && <p className={Styles.errorMessage}>{errorMessage}</p>}
            <SubmitButton visualType="login" />
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentLogin;