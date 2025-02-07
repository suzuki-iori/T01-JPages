import React from 'react'
import './graphFilterModal.module.css'; 
const graphFilterModal = ({ isOpen, onClose, yearOptions, divisionOptions, selectedYears, selectedDivisions, handleYearChange, handleDivisionChange }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={overlay}>
      <div className="modal-content" style={modalContent}>
        <h2>選択する項目</h2>
        <button onClick={onClose}>閉じる</button>
        <div>
          <h4>年を選択:</h4>
          {yearOptions.map(year => (
            <label key={year}>
              <input 
                type="checkbox" 
                value={year} 
                checked={selectedYears.includes(year)} 
                onChange={handleYearChange} 
              />
              {year}
            </label>
          ))}
        </div>
        <div>
          <h4>DIVISIONを選択:</h4>
          {divisionOptions.map(division => (
            <label key={division.id}>
              <input 
                type="checkbox" 
                value={division.id} 
                checked={selectedDivisions.includes(division.id)} 
                onChange={handleDivisionChange} 
              />
              {division.name}
            </label>
          ))}
        </div>
      </div>
    </div>
      );
    };

    const modalContent = {
        background: "white",
        width: "500px",
        height: "500px",
        padding: "10px",
        borderRadius: "10px",
    };
    
    const overlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

export default graphFilterModal
