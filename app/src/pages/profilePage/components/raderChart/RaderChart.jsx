import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js'; // Chart.jsをインポート
import Styles from './raderChart.module.css';

Chart.register(...registerables);

const RaderChart = ({ data }) => {
	const canvasRef = useRef(null); // canvasを参照するためのrefを作成

	useEffect(() => {
		const ctx = canvasRef.current.getContext("2d"); // refを使ってcontextを取得
		const myRadarChart = new Chart(ctx, {
			type: 'radar',
			data: {
				labels: data.map(item => item.name), // ラベルはデータから取得
				datasets: [{
					label: '', // データセットのラベルを空に設定
					data: data.map(item => parseInt(item.score)), // scoreを数値に変換
					backgroundColor: 'rgba(135, 99, 68, 0.6)', // 半透明の背景色
					borderColor: '#876344',
					borderWidth: 2,
					pointBackgroundColor: 'RGB(46,106,177)',
					pointRadius: 0
				}]
			},
			options: {
				font: {
					weight: 'bold',
					size: 14
				},
				responsive: true, // レスポンシブ対応
				scales: {
					r: {
						min: 0,
						max: 100,
						ticks: {
							stepSize: 100, // ステップサイズを調整
							display: false,
						},
						beginAtZero: true,
					},
				},
				plugins: {
					legend: {
						display: false // 凡例を非表示に設定
					},
					title: {
						display: false // タイトルを非表示に設定
					},
					datalabels: {
						display: false, // デフォルトのデータラベルを無効化（カスタムで実装）
					},
				},
				maintainAspectRatio: false // アスペクト比を維持しない
			}
		});

		// クリーンアップ関数
		return () => {
				myRadarChart.destroy(); // コンポーネントのアンマウント時にチャートを破棄
		};
	}, [data]); // dataが変更されるたびにチャートを再描画

	return (
		<>
			<canvas ref={canvasRef} className={Styles.container}></canvas> {/* refを使用 */}
		</>
	);
}

export default RaderChart;
