# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
// import React, { useRef } from "react";
// import { useDrag, useDrop } from "react-dnd";
// import styles from './SortableItem.module.css';
// import { useAuth } from "../../../context/AuthContext";
// import Ajax from "../../../hooks/Ajax";
// import { useState,useEffect } from "react";

// const ItemTypes = {
//   CARD: "card"
// };

// const style = {
//   border: "1px solid #ddd",
//   padding: "0.5rem 1rem",
//   cursor: "move",
//   listStyle: "none"
// };

// export const SortableItem = ({ item, index, onSortEnd }) => {
//   const token = useAuth();
//   const ref = useRef(null);
//   const [ansData,setAnsData] = useState([]);

//   console.log(item);
  

//   useEffect(() => {
//     Ajax(null, token.token, `survey/answer/${item.questionnaire_id}`, 'get')
//       .then((data) => {
//         if (data.status === "success") {
//           setAnsData(data);
//           console.log("解凍データ",data);
          
//         } else {
//           console.log("取得失敗");
//         }
//       });
//   }, []); 

//   const [{ handlerId }, drop] = useDrop({
//     accept: ItemTypes.CARD,
//     collect(monitor) {
//       return {
//         handlerId: monitor.getHandlerId()
//       };
//     },
//     hover(dragItem, monitor) {
//       if (!ref.current) {
//         return;
//       }

//       const dragIndex = dragItem.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) {
//         return;
//       }

//       const hoverBoundingRect = ref.current.getBoundingClientRect();
//       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top;

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
//         return;
//       }

//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
//         return;
//       }

//       onSortEnd(dragIndex, hoverIndex);
//       dragItem.index = hoverIndex;
//     }
//   });

//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.CARD,
//     item: () => {
//       return { id: item.id, index };
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging()
//     })
//   });

//   const opacity = isDragging ? 0 : 1;

//   drag(drop(ref));

//   return (
//     <li ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId} className={styles.quevalue}>
//       {item.question}
//       <p>aaaa</p>
//     </li>
//   );
// };