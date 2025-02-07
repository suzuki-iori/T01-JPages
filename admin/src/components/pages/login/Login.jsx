import React, { useState } from 'react';
import styles from "./Login.module.css";
import Ajax from '../../../hooks/Ajax';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [errFlag, setErrFlag] = useState(true);
    const [inputError, setInputError] = useState(''); 
    const { login } = useAuth();
    const navigate = useNavigate(); 

    const inputAccount = (e) => {
        const value = e.target.value;
        if (value.length > 255) {
            setInputError('アカウント名は255文字以内で入力してください。');
            setErrFlag(false);
        } else {
            setInputError('');
            setErrFlag(true);
            setAccount(value);
        }
    }

    const inputPassword = (e) => {
        const value = e.target.value;
        if (value.length > 255) {
            setInputError('パスワードは255文字以内で入力してください。');
            setErrFlag(false);
        } else {
            setInputError('');
            setErrFlag(true);
            setPassword(value);
        }
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();

        // エラーメッセージの初期化
        setInputError('');
        setErrFlag(true);

        if (account.trim() === '' && password.trim() === '') {
            setInputError('アカウントとパスワードを入力してください');
            setErrFlag(false);
            return;
        }
        if (account.trim() === '') {
            setInputError('アカウントを入力してください');
            setErrFlag(false);
            return;
        }
        if (password.trim() === '') {
            setInputError('パスワードを入力してください');
            setErrFlag(false);
            return;
        }

        const req = {
            account: account,
            password: password
        };

        Ajax(null, null, 'login', 'POST', req)
        .then((data) => {
            if (data.status === "success") {
                const token = data.token;
                login(token);
                navigate('/admin');
            } else {
                setErrFlag(false);
                setInputError('アカウントまたはパスワードに誤りがあります');
            }
        });
    }

    return (
        <>
            <div className={styles.loginPage}>
                <div className={styles.loginArea}>
                    <h1 className={styles.loinLogo}>JPages</h1>
                    <form onSubmit={handleSubmit} className={styles.uiForm}>
                        <dl>
                            <div className={styles.formField}>
                                <dt><label htmlFor="account">account</label></dt>
                                <dd><input type="text" id="account" onChange={inputAccount}></input></dd>
                            </div> 
                            <div className={styles.formField}>
                                <dt><label htmlFor="password">password</label></dt>
                                <dd><input type="password" id="password" onChange={inputPassword}></input></dd>
                            </div>
                            <p className={styles.err}>{inputError}</p> {/* エラーメッセージを表示 */}
                        </dl>
                        <button type="submit" className={styles.loginButton}>OK</button>
                    </form>
                </div>  
            </div>
        </>
    );
}

export default Login;
