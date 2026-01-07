import React from "react";
import style from "./ReviewComfirmDialog.module.scss";

function ReviewComfirmDialog(props) {
  // props
  const {planValue, designValue, skillValue, presentValue, positiveValue, negativetValue, otherValue, setComfirmDialogOprn, postRating} = props;
  
  return (
    <div className={style.dialogBg}>
        <div className={style.dialog}>
          <h2>以下の内容で送信します</h2>
          <dl>
            <div className={style.flex}><dt>企画</dt><dd>{planValue}</dd></div>
            <div className={style.flex}><dt>デザイン</dt><dd>{designValue}</dd></div>
            <div className={style.flex}><dt>技術</dt><dd>{skillValue}</dd></div>
            <div className={style.flex}><dt>プレゼン</dt><dd>{presentValue}</dd></div>
            {positiveValue && <div className={`${style.flex} ${style.column}`}><dt>良い点</dt><dd>{positiveValue}</dd></div>}
            {negativetValue && <div className={`${style.flex} ${style.column}`}><dt>改善点</dt><dd>{negativetValue}</dd></div>}
            {otherValue && <div className={`${style.flex} ${style.column}`}><dt>その他</dt><dd>{otherValue}</dd></div>}
          </dl>
          <ul className={style.btns}>
            <li>
              <button type="button" className={style.btnClose} onClick={() => setComfirmDialogOprn(false)}>変更する</button>
            </li>
            <li>
              <button type="button" className={style.submit} onClick={postRating}>投稿する</button>
            </li>
          </ul>
        </div>
    </div>
  );
}
export default ReviewComfirmDialog;