import React from 'react';
import comingsoon from "../images/comingsoon2.gif"

const Comingsoon = () => {
    return (
        <>
            <h1 className="comingsoon" style={{ fontSize: "18px" }}><i className="bi bi-clock-history fs-2"></i> <img width="270" src={comingsoon} alt="Coming Soon Img"></img></h1>
        </>
    );
};

export default Comingsoon;