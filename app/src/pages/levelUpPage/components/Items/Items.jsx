import React, { useEffect, useContext, useState, useRef } from "react";
import style from './Items.module.scss';
import Ajax from "../../../../lib/Ajax";
import { AppContext } from "../../../../context/AppContextProvider";
import Item from '../../../../components-old/atoms/item/Item';

function Items(props) {
  // props
  const {characterGet} = props;

  // data
  const [items, setItems] = useState([]);
  const [top, settop] = useState();
  // ref
  const elementRef = useRef(null);

  //useContext
  const {
    setAppState,
    setLoginToken,
    setLoginTeamId,
    setLoading,
    activeTeam,
    setToast
  } = useContext(AppContext);

  // アイテムを取得し成長されていないものを表示する
  const init = () => {
    setLoading(true);
    // チームアイテムを取得
    Ajax(null, `rating/${activeTeam.id}`)
    .then((data) => {
      if(data.status === 'failure') {
        // 失敗
        setToast({toast: true, state: 'teamTop', message: '存在しないチームです。別のチームをお試しください。'})
      }
      // 成長に使われていないもののみ格納する
      else if(data.rating) {
        setItems(data.rating.filter(e => !e.isserve));
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("アイテムが取得できませんでした", error);
      setAppState('visitorLogin');
      setLoginToken('');
      setLoginTeamId('');
      setLoading(false);
    });
  };

  // useEffect
  useEffect(() => {
    init();
    // アイテム表示領域のtopを取得する
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      settop(rect.top);
    }
    characterGet();
  }, []);


  return (
    <div className={style.itemsWrap} ref={elementRef}>
      {!(items.length > 0) && <p className={style.message}>評価されるとアイテムを取得できます</p>}
      <ul className={style.items}>
        {items.map(e => {
          return (
            <Item
              key={'item' + e.id}
              data={e}
              wrapTop={top}
              init={init}
              characterGet={characterGet}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default Items;