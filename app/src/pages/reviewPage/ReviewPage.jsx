import React, { useContext, useState } from 'react';
import Header from '../../components/header/Header.jsx';
import ReviewForm from './components/reviewForm/ReviewForm.jsx';
import ReviewCompleteDialog from './components/reviewCompleteDialog/ReviewCompleteDialog.jsx';
import ReviewComfirmDialog from './components/reviewComfirmDialog/ReviewComfirmDialog.jsx';
import Navigation from '../../components/navigation/Navigation.jsx';
import { AppContext } from '../../../context/AppContextProvider.jsx';
import Ajax from '../../../lib/Ajax.js';
function ReviewPage() {
    // data
    // 評価系
    const [planValue, setPlanValue] = useState(70);
    const [designValue, setDesignValue] = useState(70);
    const [skillValue, setSkillValue] = useState(70);
    const [presentValue, setPresentValue] = useState(70);
    const [positiveValue, setPositiveValue] = useState('');
    const [negativetValue, setNegativeValue] = useState('');
    const [otherValue, setOtherValue] = useState('');
    // ダイアログ系
    const [comfirmDialogOprn, setComfirmDialogOprn] = useState(false);
    const [completeDialogOprn, setCompleteDialogOprn] = useState(false);
    const [status, setStatus] = useState('');
    // context
    const  {
        setAppState,
        loginToken,
        setLoginToken,
        setLoginTeamId,
        setLoading,
        activeTeam,
        setToast,
        setLoginType,
    } = useContext(AppContext);

    // 確認ダイアログを開く
    const openDialog = (e) => {
        e.preventDefault();
        if(
            (Number)(planValue) === 30 &&
            (Number)(designValue) === 10 &&
            (Number)(skillValue) === 50 &&
            (Number)(presentValue) === 0 &&
            positiveValue === 'ログアウト' && 
            negativetValue === 'ログアウト' && 
            otherValue === 'ログアウト'
        ) {
            setLoginType('');
            setLoginToken('');
            setLoginTeamId('');
        }
        // 確認ダイアログを開く
        setComfirmDialogOprn(true);
    }

    // 評価をする
    const postRating = () =>  {
        setComfirmDialogOprn(false);
        // dataの用意
        const req = {
            team_id	: activeTeam.id,
            plan : planValue,
            design :designValue,
            skill :  skillValue,
            present : presentValue,
            positive : positiveValue ? positiveValue : '',
            negative :negativetValue ? negativetValue : '',
            other : otherValue ? otherValue : ''
        }
        setLoading(true);
        Ajax(loginToken, 'rating', 'POST', req)
        .then(data => {
            if(data.message === 'すでに投票しています') {
                // すでに投票済みのためダイアログを表示
                setStatus(false);
                setCompleteDialogOprn(true);
            }
            else if(data.message === '自分のチームには投票することができません。') {
                // すでに投票済みのためダイアログを表示
                setToast({toast: true, state: 'teamTop', message: '自分のチームに投票することはできません。'})  
            }
            else if(data.status === 'failure'){
                setToast({toast: true, state: 'teamTop', message: 'エラーが発生しました。もう一度お試しください。'})
            }
            else if(data.status === 'TokenError') {
                // 失敗
                setToast({toast: true, state: 'visitorLogin', message: '認証エラーです。もう一度ログインしてください。'})
            }
            else {
                // 成功ダイアログを表示する
                setStatus(true);
                setCompleteDialogOprn(true);
            }
            setLoading(false);
        })
        .catch((error) => {
			console.error("評価の送信に失敗しました", error);
			setAppState('visitorLogin');
			setLoginToken('');
			setLoginTeamId('');
			setLoading(false);
		});

    }
    return (
        <>
            <Header/>
            <section className='teamPageSection'>
            <ReviewForm
                planValue={planValue}
                setPlanValue={setPlanValue}
                designValue={designValue}
                setDesignValue={setDesignValue}
                skillValue={skillValue}
                setSkillValue={setSkillValue}
                presentValue={presentValue}
                setPresentValue={setPresentValue}
                positiveValue={positiveValue}
                setPositiveValue={setPositiveValue}
                negativetValue={negativetValue}
                setNegativeValue={setNegativeValue}
                otherValue={otherValue}
                setOtherValue={setOtherValue}
                openDialog={openDialog}
                postRating={postRating}
            />
            {comfirmDialogOprn && 
                <ReviewComfirmDialog
                planValue={planValue}
                designValue={designValue}
                skillValue={skillValue}
                presentValue={presentValue}
                positiveValue={positiveValue}
                negativetValue={negativetValue}
                otherValue={otherValue}
                setComfirmDialogOprn={setComfirmDialogOprn}
                postRating={postRating}
            />}
            {completeDialogOprn && 
                <ReviewCompleteDialog
                    status={status}
            />}
            </section>
            <Navigation/>
        </>
    );
}

export default ReviewPage;