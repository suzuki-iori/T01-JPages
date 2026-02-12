import React, { useState, useCallback, useEffect } from "react";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SortableItem } from "../../base/DnD/SortableItem";
import { useAuth } from '../../../context/AuthContext';
import styles from './QeDetail.module.css';
import AddQueModal from "../../base/modal/addqueModal/AddQueModal";
import EditQueModal from "../../base/modal/editQeModal/EditQueModal";
import Ajax from "../../../hooks/Ajax";
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from "react-router-dom";
import DeleteModal from "../../base/modal/deleteModal/DeleteModal";
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

const QeDetail = () => {
  const token = useAuth();
  const [newque, setNewQue] = useState();
  const [queTitle, setQueTitle] = useState();
  const [isActive, setIsActive] = useState(false);
  const [addFlag, setAddFlag] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const getId = useParams();

  const ShowModal = () => {
    setShowModal(true);
  };

  const ShowDeleteModal = () => {
    setDeleteModal(true);
  };

  // 編集はモーダル内で項目を選んで行うため、親側で editingItem を持たない

  const handlePublish = () => {
    Swal.fire({
      title: '公開しますか？',
      text: `「${queTitle}」を公開します。\n（他の公開中アンケートは非公開になります）`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい、公開します',
      cancelButtonText: 'キャンセル'
    }).then((result) => {
      if (result.isConfirmed) {
        const req = {
          title: queTitle,
          is_active: true
        };

        Ajax(null, token.token, `questionnaire/${getId.id}`, 'put', req)
          .then((data) => {
            if (data.status === "success") {
              setIsActive(true);
              Swal.fire('完了', '公開しました！', 'success');
            } else {
              Swal.fire('エラー', '公開に失敗しました。', 'error');
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire('エラー', 'エラーが発生しました。', 'error');
          });
      }
    });
  };

  useEffect(() => {
    Ajax(null, token.token, 'questionnaire', 'get')
      .then((data) => {
        if (data.status === "success") {
          const filt = data.questionnaire.find(item => item.id === parseInt(getId.id, 10));
          if (filt) {
            setQueTitle(filt.title);
            setIsActive(filt.is_active);
          }
        }
      });
  }, [token.token, getId.id]);

  useEffect(() => {
    setLoading(true);
    Ajax(null, token.token, `questionnaire/${getId.id}`, 'get')
      .then((data) => {
        if (data.status === "success") {
          setItems(data.questionnaire || []);
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


  const handleSaveOrder = () => {
    const promises = items.map((item, index) => {
      const req = {
        question: item.question,
        isstring: item.isstring,
        order_number: index + 1
      };
      return Ajax(null, token.token, `survey/${item.id}`, 'put', req);
    });

    Promise.all(promises);
  };

  return (
    <>
      <div className={styles.queDetailWrapper}>
        <div className={styles.chAreaWrapper}>
          <div className={styles.makeChangesArea}>
            <h2>{queTitle}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="contained"
                color={isActive ? "inherit" : "success"}
                disabled={isActive}
                onClick={handlePublish}
                style={isActive ? { backgroundColor: '#e0e0e0', color: '#888' } : {}}
              >
                {isActive ? "公開中" : "公開する"}
              </Button>
              <Button variant="contained" color="primary" onClick={ShowModal}>+質問追加</Button>
              <Button variant="contained" color="secondary" onClick={() => setEditModal(true)}>質問の編集</Button>
              <Button variant="contained" color="error" onClick={ShowDeleteModal}>×削除</Button>
            </div>
          </div>
        </div>

        <AddQueModal
          setAddFlag={setAddFlag}
          setNewQue={setNewQue}
          showFlag={showModal}
          setShowModal={setShowModal}
          items={items || []}
        />

       {editModal && (
          <EditQueModal
            showFlag={editModal}
            setShowModal={setEditModal}
            items={items || []}
          />
        )}

        <DeleteModal
          showFlag={deleteModal}
          setShowModal={setDeleteModal}
          queData={items || []}
        />

        {loading ? (
          <article className={styles.loadingArea}>
            <CircularProgress color="primary" />
          </article>
        ) : items.length === 0 ? (
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
                        onSaveOrder={handleSaveOrder}
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