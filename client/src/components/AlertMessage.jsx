import React, { useEffect } from 'react';
import '../styles/AlertMessage.css'; // You can style it however you want

const AlertMessage = ({ message, type = 'success', onClose }) => {

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className={`alert-box ${type}`}>
        <span className="alert-msg">{message}</span>
        <button onClick={onClose} className="close-btn">Back</button>
      </div>
    </>
  );
};

export default AlertMessage;
