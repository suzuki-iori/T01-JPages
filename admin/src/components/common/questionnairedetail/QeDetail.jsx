import React, { useState, useCallback, useEffect } from "react";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SortableItem } from "../../base/DnD/SortableItem";
import { useAuth } from '../../../context/AuthContext';
import styles from './QeDetail.module.css';
import AddQueModal from "../../base/modal/addqueModal/AddQueModal";
import Ajax from "../../../hooks/Ajax";
import CircularProgress from '@mui/material/CircularProgress'; // CircularProgressをインポート
import { useParams } from "react-router-dom";
import DeleteModal from "../../base/modal/deleteModal/DeleteModal";
import Button from '@mui/material/Button'; // MUIのボタンをインポート

const QeDetail = () => {
  const token = useAuth();
  const [newque, setNewQue] = useState();
  const [queTitle, setQueTitle] = useState();
  const [addFlag, setAddFlag] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const getId = useParams();

  const ShowModal = () => {
    setShowModal(true);
  };

  const ShowDeleteModal = () => {
    setDeleteModal(true);
  };

  useEffect(() => {
    Ajax(null, token.token, 'questionnaire', 'get')
      .then((data) => {
        if (data.status === "success") {
          const filt = data.questionnaire.find(item => item.id === parseInt(getId.id, 10));
          setQueTitle(filt.title);
        } else {
          console.log(data.status);
        }
      });
  }, [token.token, getId.id]); 

  useEffect(() => {
    setLoading(true); 
    Ajax(null, token.token, `questionnaire/${getId.id}`, 'get')
      .then((data) => {
        if (data.status === "success") {
          setItems(data.questionnaire);
        } else {
          console.log(data.status);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token.token, getId.id]);

  const handleSort = useCallback((dragIndex, hoverIndex) => {
    setItems((prevRows) =>
      update(prevRows, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevRows[dragIndex]]
        ]
      })
    );
  }, []);

  return (
    <>
      <div className={styles.queDetailWrapper}>
        <div className={styles.chAreaWrapper}>
          <div className={styles.makeChangesArea}>
            <h2>{queTitle}</h2>
            <div>
              <Button variant="contained" color="primary" onClick={ShowModal}>+質問追加</Button>
              <Button variant="contained" color="secondary" onClick={ShowDeleteModal}>×削除</Button>
            </div>
          </div>
        </div>
        <AddQueModal 
          setAddFlag={setAddFlag} 
          setNewQue={setNewQue} 
          showFlag={showModal} 
          setShowModal={setShowModal} 
          items={items} 
        />
        <DeleteModal 
          showFlag={deleteModal} 
          setShowModal={setDeleteModal} 
          items={items} 
        />
        {loading ? ( // ローディング中の表示
          <article className={styles.loadingArea}>
            <CircularProgress color="primary" />
          </article>
        ) : items.length === 0 ? ( // itemsが空の場合の表示
          <div className={styles.noQuestions}>
            <p>
              質問は登録されていません<br />
              画面上部の+ボタンから登録してください
            </p>
          </div>
        ) : (
          <>
              <div className={styles.queArea}>
                <DndProvider backend={HTML5Backend}>    
                  <ul className={styles.dndArea}>
                    {items && (items.map((item, index) => (
                      <SortableItem
                        key={item.id}
                        index={index}
                        item={item}
                        onSortEnd={handleSort}
                      />)
                    ))}
                  </ul>
                </DndProvider>
              </div>
          </>
        )}
      </div>
    </>
  );
}

export default QeDetail;
