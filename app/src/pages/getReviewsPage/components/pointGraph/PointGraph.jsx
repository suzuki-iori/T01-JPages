import React, { useEffect, useState } from 'react';
import styles from './PointGraph.module.scss';
import { Doughnut } from 'react-chartjs-2';
import chartjsPluginDatalabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.jsのプラグイン登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  chartjsPluginDatalabels
);

function PointGraph({ getReviewData }) {
  const [sumPlan, setSumPlan] = useState(0);
  const [sumDesign, setSumDesign] = useState(0);
  const [sumSkill, setSumSkill] = useState(0);
  const [sumPresent, setSumPresent] = useState(0);

  useEffect(() => {
    // データ集計
    let plan = 0;
    let design = 0;
    let skill = 0;
    let present = 0;
    getReviewData.forEach(e => {
      plan += e.point.plan;
      design += e.point.design;
      skill += e.point.skill;
      present += e.point.present;
    });
		if(plan === 0 && design === 0 && skill === 0 && present === 0 )
		{
			setSumPlan(1);
			setSumDesign(1);
			setSumSkill(1);
			setSumPresent(1);
		} else {
			setSumPlan(plan);
			setSumDesign(design);
			setSumSkill(skill);
			setSumPresent(present);
		}

    // 中央テキスト描画プラグイン
    const centerTextPlugin = {
      id: 'centerTextPlugin',
      beforeDraw(chart) {
        const { width } = chart;
        const { top, height } = chart.chartArea;
        const ctx = chart.ctx;
        let total = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
				total = total === 4 ? 0 : total;
        ctx.save()
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#219752';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${total} pt`, width / 2, top + height / 2);
        ctx.restore();
      },
    };

    // データラベルプラグイン: パーセント表示
    const percentageLabelPlugin = {
      id: 'percentageLabelPlugin',
      afterDraw(chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              let value = dataset.data[index];
							value = value === 1 ? 0 : value;
              const label = chart.data.labels[index];
              const position = element.tooltipPosition();
              ctx.font = 'bold 16px Arial';
              ctx.fillStyle = '#876344';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, position.x, position.y - 10);
              ctx.fillText(value, position.x, position.y + 10);
            });
          }
        });
      },
    };

    ChartJS.register(centerTextPlugin, percentageLabelPlugin);

    return () => {
      // プラグインの登録解除
      ChartJS.unregister(centerTextPlugin, percentageLabelPlugin);
    };
  }, [getReviewData]);

  const labels = ['Plan', 'Design', 'Skill', 'Present'];
  const graphData = {
    labels: labels,
    datasets: [
      {
        data: [sumPlan, sumDesign, sumSkill, sumPresent],
        backgroundColor: ['#facccc', '#e7c9f1', '#c6d8ff', '#C6F8F8'],
        borderColor: '#CDE9B9',
        borderWidth: 5,
      },
    ],
  };

  const options = {
    plugins: {
        datalabels: {
					display: false, // デフォルトのデータラベルを無効化（カスタムで実装）
        },
        legend: {
					display: false
        },
    },
    
    cutout: '40%', // ドーナツ内側の空白サイズ
    responsive: true,
    maintainAspectRatio: false,
    color: '#CDE9B9'
  };

  return (
    <div className={styles.pointGraph}>
			<Doughnut data={graphData} options={options} height={300} width={300} />
    </div>
  );
}

export default PointGraph;
