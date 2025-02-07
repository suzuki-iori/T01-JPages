import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.jsの設定
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
let ntime = new Date;

const RealTimeChart = (props) => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'データセット1',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'データセット2',
        data: [2, 3, 20, 5, 1],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'データセット3',
        data: [3, 10, 13, 15, 22],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RealTimeChart;
