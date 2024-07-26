import React from 'react'

export default function Notification({ message, onClose }) {
    return (
        <div style={{ padding: '10px', background: 'green', color: 'white', position: 'fixed', top: '80px', right: '10px', borderRadius: '5px' }}>
          {message}
          <button type='button' className='btn text-white' onClick={onClose} style={{ marginLeft: '10px' }}>X</button>
        </div>
    );
}