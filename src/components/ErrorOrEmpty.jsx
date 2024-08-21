import React from 'react';
import styles from './Error.module.css';
import { FaArrowRight } from "react-icons/fa";
const ErrorOrEmpty = ({img,msg,showButton,onButtonClick}) => {
    const handleButtonClick = () => {
        if (onButtonClick) {
          onButtonClick();
        }
      }
  return (
    <div className={styles.ErrorOrEmpty}>
        <h3>{msg}</h3>
        {showButton && (
        <button onClick={handleButtonClick}>Buy Videos  <FaArrowRight /></button>
      )}
        <img src={img} alt="Error" />
       
    </div>
  )
}

export default ErrorOrEmpty;