import React from "react";
import { useState } from 'react';

const LocalClock = () => {
    let time = new Date().toLocaleTimeString();
    const [currentTime, setCurrentTime] = useState(time);

    const updateTime = () => {
        let time = new Date().toLocaleTimeString();
        setCurrentTime(time);
    }

    setInterval(updateTime, 1000/*ms*/);
    
    return (
        <div>
            Local: {currentTime}
        </div>    
    )

}

export default LocalClock