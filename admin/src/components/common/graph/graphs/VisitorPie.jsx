import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import styles from './graphs.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const VisitorPie = ({ data }) => {
  // 司令塔(Graphs.jsx)から受け取った filteredVisitors を集計
  const visitors = data?.visitor || [];
  
  const div1 = visitors.filter(v => v.division === 1).length;
  const div2 = visitors.filter(v => v.division === 2).length;
  const div3 = visitors.filter(v => v.division === 3).length;
  const div4 = visitors.filter(v => v.division === 4).length;
  const div5 = visitors.filter(v => v.division === 5).length;

  const chartData = {
    labels: ['企業', '学生', '学校関係者', '卒業生', 'その他'],
    datasets: [
      {
        data: [div1, div2, div3, div4, div5],
        backgroundColor: [
          '#555555', // 企業
          '#4caf50', // 学生
          '#ff9800', // 学校関係者
          '#f44336', // 卒業生
          '#999999', // その他
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // コンテナのサイズに合わせる
    plugins: {
      legend: {
        position: 'bottom', // 凡例は下の方がバランスが良い
        labels: {
          boxWidth: 12,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: '訪問者の内訳',
        font: { size: 16 }
      },
    },
  };

  return ( 
    <div className={styles.pieContainer}>
      <Pie data={chartData} options={options}/>
    </div>
  );
};