import React from "react";

const Confirm = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="confirm">
      <div className="confirm__window">
        <div className="confirm__titlebar">
          <span className="confirm__title">{title}</span>
          <button className="confirm__close" onClick={onCancel}>&times;</button>
        </div>
        <div className="confirm__content">{message}</div>
        <div className="confirm__buttons">
          <button className="confirm__button confirm__button--ok confirm__button--fill" onClick={onConfirm}>
            OK
          </button>
          <button className="confirm__button confirm__button--cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
