// useRequireAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { useAuth } from '../context/AuthContext'; // AuthProviderのパスを指定

const useRequireAuth = () => {
    const navigate = useNavigate(); // useNavigateを使用
    const { token } = useAuth();

    useEffect(() => {
        if (token === null) {
            navigate('/admin/login'); // ログイン画面のパスを指定
        }
    }, [token, navigate]);
};

export default useRequireAuth;
