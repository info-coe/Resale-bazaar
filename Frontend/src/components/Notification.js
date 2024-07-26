import React from 'react';

export default function Notification({ message, type, onClose }) {
    const backgroundColor = type === 'error' ? 'red' : 'green';

    const styles=`
    .notification {
    padding: 25px;
    color: white;
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    display: flex;
 justify-content: space-between;
    align-items: center;
    font-size: 18px;
    max-width: 90%;
    box-sizing: border-box;
    z-index: 1050;
    min-width: 300px;
}

.notification.green {
    background: green;
}

.notification.red {
    background: red;
}

.close-btn {
    // margin-left: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-top:-15px;
}

@media (max-width: 600px) {
    .notification {
        padding: 15px;
        font-size: 16px;
        top: 80px;
        width: 100%;
        left: 0;
        transform: none;
         left: 50%;
    transform: translateX(-50%);
     display: flex;
    justify-content-between: center;
    align-items: center;
    }
    .close-btn {
        font-size: 16px;
    }
}

    `
    
    return (
        <>
         <style>{styles}</style>
        <div className={`notification ${backgroundColor}`}>
           
            <p>{message}</p>
            <button 
                type='button' 
                className='close-btn' 
                onClick={onClose}
            >
                X
            </button>
        </div>
        </>
    );
}


// import React from 'react';

// export default function Notification({ message, type, onClose }) {
//     const backgroundColor = type === 'error' ? 'red' : 'green';
    
//     return (
//         <div style={{ 
//             padding: '25px', 
//             background: backgroundColor, 
//             color: 'white', 
//             position: 'fixed', 
//             top: '100px', 
//             left: '50%', 
//             transform: 'translateX(-50%)', 
//             borderRadius: '5px',
//             display: 'flex', 
//             alignItems: 'center',
//             fontSize:"18px"
//         }}>
//             {message}
//             <button 
//                 type='button' 
//                 className='btn text-white' 
//                 onClick={onClose} 
//                 style={{ marginLeft: '10px' }}
//             >
//                 X
//             </button>
//         </div>
//     );
// }


// import React from 'react';

// export default function Notification({ message, type, onClose }) {
//     const backgroundColor = type === 'error' ? 'red' : 'green';
    
//     return (
//         <div style={{ padding: '10px', background: backgroundColor, color: 'white', position: 'fixed', top: '80px', right: '10px', borderRadius: '5px' }}>
//             {message}
//             <button type='button' className='btn text-white' onClick={onClose} style={{ marginLeft: '10px' }}>X</button>
//         </div>
//     );
// }




// import React from 'react'

// export default function Notification({ message, onClose }) {
//     return (
//         <div style={{ padding: '10px', background: 'green', color: 'white', position: 'fixed', top: '80px', right: '10px', borderRadius: '5px' }}>
//           {message}
//           <button type='button' className='btn text-white' onClick={onClose} style={{ marginLeft: '10px' }}>X</button>
//         </div>
//     );
// }