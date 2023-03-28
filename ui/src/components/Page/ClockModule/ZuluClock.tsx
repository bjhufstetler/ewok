import React from "react";
import { useState } from 'react';

const ZuluClock = () => {
    let time = new Date().toUTCString();
    const [currentTime, setCurrentTime] = useState(time);

    const updateTime = () => {
        let time = new Date().toUTCString();
        setCurrentTime(time);
    }

    setInterval(updateTime, 1000/*ms*/);
    
    return (
        <div>
            Zulu: {currentTime.substring(17,25)}
        </div>    
    )

}

export default ZuluClock;
