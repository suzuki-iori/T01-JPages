import React from 'react';
import styles from './graphFilterModal.module.css';

const GraphFilterModal = ({ 
  isOpen, onClose, yearOptions, divisionOptions, 
  selectedYears, selectedDivisions, 
  handleYearChange, handleDivisionChange,
  chartType, setChartType 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.body}>
          
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>表示年度</h4>
            <div className={styles.optionsGrid}>
              {yearOptions.map((year) => (
                <label 
                  key={year} 
                  className={`${styles.optionLabel} ${selectedYears.includes(year) ? styles.selected : ''}`}
                >
                  <input 
                    type="radio" name="year" className={styles.hiddenInput}
                    value={year} checked={selectedYears.includes(year)} onChange={handleYearChange}
                  />
                  {year}年度
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>表示カテゴリー</h4>
            <div className={styles.optionsGrid}>
              {divisionOptions.map((div) => (
                <label 
                  key={div.id} 
                  className={`${styles.optionLabel} ${selectedDivisions.includes(div.id) ? styles.selected : ''}`}
                >
                  <input 
                    type="checkbox" className={styles.hiddenInput}
                    value={div.id} checked={selectedDivisions.includes(div.id)} onChange={handleDivisionChange}
                  />
                  {div.name}
                </label>
              ))}
            </div>
          </div>

          {/* 3. 表示形式 (単一選択) - UIを完全統一 */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>表示形式</h4>
            <div className={styles.optionsGrid}>
              {[
                { id: 'bar', name: '棒グラフ' },
                { id: 'line', name: '折れ線グラフ' }
              ].map((type) => (
                <label 
                  key={type.id} 
                  className={`${styles.optionLabel} ${chartType === type.id ? styles.selected : ''}`}
                >
                  <input 
                    type="radio" name="type" className={styles.hiddenInput}
                    value={type.id} checked={chartType === type.id}
                    onChange={(e) => setChartType(e.target.value)}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.footer}>
          <button className={styles.finishButton} onClick={onClose}>適用して閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default GraphFilterModal;