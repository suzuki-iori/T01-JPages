import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import styles from './graphs.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const TestModel = ({ data, selectedYear, selectedDivisions,chartType = 'bar'}) => {
  console.log(chartType);
  
  const chartData = useMemo(() => {
    const visitors = data?.visitor || [];
    const startHour = 10;
    const endHour = 17;
    const labels = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      labels.push(`${hour}:00`);
      if (hour !== endHour) labels.push(`${hour}:30`);
    }

    const divisionCounts = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    Object.keys(divisionCounts).forEach(k => divisionCounts[k] = new Array(labels.length).fill(0));

    visitors.forEach((item) => {
      const itemDate = new Date(item.created_at);
      const itemHour = itemDate.getHours();
      const itemMinute = itemDate.getMinutes();
      const itemYear = itemDate.getFullYear();

      const isYearMatch = itemYear === selectedYear;
      const isDivisionMatch = selectedDivisions.includes(Number(item.division));

      if (isYearMatch && isDivisionMatch && itemHour >= startHour && itemHour <= endHour) {
        const timeLabel = `${itemHour}:${itemMinute >= 30 ? '30' : '00'}`;
        const index = labels.indexOf(timeLabel);
        if (index !== -1 && divisionCounts[item.division]) {
          divisionCounts[item.division][index]++;
        }
      }
    });

    const divisionConfig = {
      1: { label: '企業', color: '#444444' },
      2: { label: '教員', color: '#ff9800' },
      3: { label: 'JEC生徒', color: '#4caf50' },
      4: { label: 'OB・OG', color: '#f44336' },
      5: { label: 'その他', color: '#bbbbbb' },
    };

    const datasets = selectedDivisions.map((divId) => ({
      label: divisionConfig[divId].label,
      data: divisionCounts[divId],
      backgroundColor: divisionConfig[divId].color,
      borderColor: divisionConfig[divId].color,
      borderRadius: chartType === 'bar' ? 5 : 0, 
      barPercentage: 0.5,
      maxBarThickness: 20,
      stack: 'stacked',
      tension: 0.3, 
      pointRadius: 4,
    }));

    return { labels, datasets };
  }, [data, selectedYear, selectedDivisions, chartType]);

  const isDataEmpty = useMemo(() => {
    if (!chartData.datasets || chartData.datasets.length === 0) return true;
    return chartData.datasets.every(dataset => 
      dataset.data.every(val => val === 0)
    );
  }, [chartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        stacked: chartType === 'bar', 
        grid: { display: false } 
      },
      y: { 
        stacked: chartType === 'bar', 
        beginAtZero: true, 
        ticks: { stepSize: 1 } 
      }
    },
    plugins: {
      legend: { position: 'top', align: 'end' },
      title: {
        display: true,
        text: `${selectedYear}年度 訪問者数推移 (${chartType === 'bar' ? '棒グラフ' : '折れ線'})`,
        font: { size: 14 }
      }
    }
  };

  return (
    <div className={`${styles.dashboardCard} ${styles.layoutBottom}`}>
      <div className={styles.graphWrapper}>

        {isDataEmpty && (
          <div className={styles.noDataOverlay}>
            {selectedYear}年度のデータは存在しません
          </div>
        )}

        {chartType === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default TestModel;