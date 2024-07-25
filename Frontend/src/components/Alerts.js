import React, { useState } from 'react';

const Alert = ({ status, title, content, confirmbtn = true, onClose, onConfirm }) => {
  return (
    <section className="alert_modal">
      <div className="alert_container">
        <div className={`alert_heading ${status}`}>
          {status === 'success' && (
            <svg width="80" height="80" viewBox="0 0 24 24"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0" /></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0" /></path></g></svg>
          )}
          {status === 'error' && (
            <svg width="80" height="80" viewBox="0 0 24 24">
            <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path strokeDasharray="60" strokeDashoffset="60" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0" />
              </path>
              <path strokeDasharray="14" strokeDashoffset="14" d="M8 12L11 15L16 10">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0" />
              </path>
            </g>
          </svg>
        )}
        {status === 'error' && (
          <svg width="80" height="80" viewBox="0 0 24 24">
            <g fill="none" stroke="white" strokeLinecap="round" strokeWidth="2">
              <path strokeDasharray="60" strokeDashoffset="60" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0" />
              </path>
              <path strokeDasharray="8" strokeDashoffset="8" d="M12 12L16 16M12 12L8 8M12 12L8 16M12 12L16 8">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
              </path>
            </g>
          </svg>
        )}
        {status === 'info' && (
          <svg width="80" height="80" viewBox="0 0 24 24">
            <g fill="none" stroke="white" strokeLinecap="round" strokeWidth="2">
              <path strokeDasharray="60" strokeDashoffset="60" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0" />
              </path>
              <path strokeDasharray="20" strokeDashoffset="20" d="M8.99999 10C8.99999 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 10.9814 14.5288 11.8527 13.8003 12.4C13.0718 12.9473 12.5 13 12 14">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" values="20;0" />
              </path>
            </g>
            <circle cx="12" cy="17" r="1" fill="white" fillOpacity="0">
              <animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.2s" values="0;1" />
            </circle>
          </svg>
        )}
      </div>
      <div className="alert_details">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      <div className="alert_footer">
        {confirmbtn ? (
          <>
            <span className="accept" onClick={onConfirm}>Ok</span>
            <span className="close" onClick={onClose}>Cancel</span>
          </>
        ) : (
          <span className="close w-100" onClick={onClose}>Ok</span>
        )}
      </div>
    </div>
  </section>
);
};

export default Alert;
