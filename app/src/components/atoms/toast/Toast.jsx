import React, { useEffect, useContext } from 'react';
import { AppContext } from '../../AppContextProvider';
import Styles from './toast.module.css';

function Toast() {
    // context
    const {
        setAppState,
        setLoginToken,
        setLoginTeamId,
        toast,
        setToast
    } = useContext(AppContext);

    useEffect(() => {
        if (toast.state === 'visitorLogin') {
            setLoginToken('');
            setLoginTeamId('');
        }
        if (toast.state) {
            setAppState(toast.state);
        } 

        setTimeout(() => {
            setToast({toast: false, state: null, message: ''});
        }, 10000);
    })
 
    return (
        <>
            <div className={Styles.toastContainer}>
                <div className={Styles.message}>{toast.message}</div>
                <div className={Styles.progressVar}></div>
            </div>           
        </>
    )
}
export default Toast;