import React from 'react'
import EditIcon from '../../../assets/editIcon/editicon'
import styles from './EditButton.module.css'

export const EditButton = ({onClick}) => {
  return (
    <button onClick={onClick} className={styles.editbutton}>
    <EditIcon/>
  </button>
  )
}
