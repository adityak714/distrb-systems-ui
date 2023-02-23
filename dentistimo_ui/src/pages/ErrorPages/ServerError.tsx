import React from 'react';
import './ServerError.css';
import toothGif from '../../assets/sadtooth.gif';
//gif source: https://giphy.com/stickers/dental-speed-sad-cry-triste-148UapO74zEL2fDTV9
const ServerError: React.FC = () => {

    return (
        <div id="container">
            <h1 id="title">We are sorry, the page cannot be accessed at the moment and we are working hard to bring it back.</h1>
            <img id="sad-tooth" src={toothGif} alt="sadTooth" />
        </div>
    )
}

export default ServerError;