import React from 'react'
import styles from './graphs.module.css'

export const LegendList = () => {
  return (
    <>
    <ul className={styles.flexLegend}>
            <li style={{color:"#555"}}>企業</li>
            <li style={{color:'#4caf50'}}>学校関係者</li>
            <li style={{color:'#ff9800'}}>学生</li>
            <li style={{color:'#ff9800'}}>卒業生</li>
            <li style={{color:'#f44336'}}>その他</li>
    </ul>
    </>
  )
}
