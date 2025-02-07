import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './graphs.module.css'
ChartJS.register(ArcElement, Tooltip, Legend);

export const VisitorPie = (props) => {
  const div1 = props.data && props.data.visitor ? props.data.visitor.filter(visitor => visitor.division === 1).length : 0;
  const div2 = props.data && props.data.visitor ? props.data.visitor.filter(visitor => visitor.division === 2).length : 0;
  const div3 = props.data && props.data.visitor ? props.data.visitor.filter(visitor => visitor.division === 3).length : 0;
  const div4 = props.data && props.data.visitor ? props.data.visitor.filter(visitor => visitor.division === 4).length : 0;
  const div5 = props.data && props.data.visitor ? props.data.visitor.filter(visitor => visitor.division === 5).length : 0;

  const data = {
    labels: ['企業', '学生', '学校関係者', '卒業生', 'その他'],
    datasets: [
      {
        data: [div1, div2, div3, div4, div5],
        backgroundColor: [
          '#555',
          '#4caf50',
          '#ff9800',
          '#f44336',
          '#999',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '訪問者の分布',
      },
    },
  };

  return ( 
    <>
      <div style={{ width: '30%', height: '100%' }} className={styles.shadow}>
        <Pie data={data} options={options}/>;
        
      </div>
    </>
  )
};
