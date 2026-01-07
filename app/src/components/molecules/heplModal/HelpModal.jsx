import React from 'react';
import styles from './HelpModal.module.scss';
import { AppContext } from '../../../context/AppContextProvider';
import { useContext } from 'react';

const HelpModal = () => {
  const {
    appState,
    setHelpModalIsOpen
  } = useContext(AppContext);

  const pageInfo = {
    'studentLogin' : {
      body : 'こんにちは！このページは学生ログインページだよ。学籍番号と氏名を入力して、ログインしてね。'
    },
    'visitorLogin' : {
      body : 'こんにちは。このページは来場者ログインページです。名刺をお持ちの方は名刺をスキャンしてください。お持ちでない方は「手入力」ボタンをタップし、手入力で情報を竜力してください。'
    },
		'home' : {
      body : 'こちらはホームページだよ。卒業と進級の制作チームが見られるよ。左下のハンバーガーメニューを押すと、卒業制作と進級制作を切り替えられるんだ。ランキングのアイコンをタップすると、ランキングページに行けるよ。キャラクターをタップすると、チームのトップページに行けるよ！'
    },
		'ranking' : {
      body : 'ここはランキングページだよ。卒業制作と進級制作のランキングを見れるよ。画面の上のタブをタップすると、選んだ項目のランキングが見られるんだ。チームをタップすると、そのチームのくちこみページに行けるよ！'
    },
		'teamTop' : {
      body : 'ここはチームトップページです。キャラクターの状態を確認することができます。下のナビゲーションからチームを評価したり、くちこみや、詳細を確認できます。キャラクターの成長が楽しみだね！！'
    },
		'profile' : {
      body : 'ここはチームのトップページだよ。キャラクターの状態を確認できるよ。下のナビゲーションからチームを評価したり、くちこみや詳しい情報を見たりできるんだ！'
    },
		'review' : {
      body : 'ここは評価ページだよ。チームを評価できるんだ。簡単に評価してみてね！良い点や改善点、その他のことは自由に書いてね！'
    },
		'getReview' : {
      body : 'ここはくちこみページだよ。みんなの評価を確認できるよ。絞り込みボタンを使うと、並び替えたり、コメントや来場者の区分ごとに絞り込むことができるんだ！'
    },
		'levelup' : {
      body : 'ここはレベルアップページだよ。評価がスイーツになって、ドラッグでキャラクターにあげられるんだ！たくさんあげて、キャラクターを成長させよう！'
    },
    'question' : {
      body : 'ここはアンケート画面だよ！みんなの意見を聞きたいから、アンケートの回答に協力してくれると嬉しいな。このアンケートは、私たちがもっと良いものを作るための大切な参考になるんだ。ぜひ、あなたの考えや感じたことを教えてね！よろしくお願いします！'
    }
	}
  return (
    <div className={styles.HelpModalBack} onClick={() => setHelpModalIsOpen(false)}>
      <div className={styles.HelpModal}>
        <figure className={styles.image}><img src={`/assets/img/page/${appState}.png`} alt="" /></figure>
        <p className={styles.body}>{pageInfo[appState].body}</p>
        <button type="button" className={styles.btnClose}>閉じる</button>
      </div>
    </div>
  )
}

export default HelpModal