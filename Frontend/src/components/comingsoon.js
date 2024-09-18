import React from 'react';
import comingsoon from "../images/comingsoonFinalimage.png"

const Comingsoon = () => {
    return (
        <div className='' >
            <img width="60%" style={{objectFit:'contain'}} src={comingsoon} alt="Coming Soon Img"></img>
            <h6 className='d-md-flex flex-column text-secondary' style={{lineHeight:"30px" , fontSize:"18px"}}><span>We're working on exciting updates to enhance your experience.</span> <span>In the meantime, feel free to explore our other products.</span></h6>
        </div>
    );
};

export default Comingsoon;