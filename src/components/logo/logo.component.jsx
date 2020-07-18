import React from 'react';
import Tilt from 'react-tilt';

import brain from './brain.png';
import './logo.css';

const Logo = () => {

    const inputRef = React.createRef();

    return(
        <div className='ma4 mt0'>
            <Tilt ref={inputRef} className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3">
                    <img style={{paddingTop: '5px'}} src={brain} alt='Site Logo' />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;