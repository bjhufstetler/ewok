import React from "react";
import { useState, useEffect } from 'react';
import { useEwokContext } from "../../../context/EwokContext";
import './ScenarioClock.css';

// TODO: Find a way to get around the async nature of use State such that the correct boolean will emit on start/stop



const ScenarioClock = () => {
    let time = new Date().toUTCString();
    let intervalID:any;

    const {socket, ewok} = useEwokContext();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [scenarioTime, setScenarioTime] = useState(time);
    const [editTimeShow, setEditTimeShow] = useState<boolean>(false);

    // This is just to show the EWOK context current details at each page for debug purposes
    console.log("Server: "+ewok.server)
    console.log("BaseURL: "+ewok.baseURL)
    console.log("Team: "+ewok.team)

    // Edit Popup Form
    const TimeSetForm = () => {
        return (
            <div className="timeInput">
                <div className="TIBox">
                    <input placeholder="HH"></input>:
                    <input placeholder="MM"></input>:
                    <input placeholder="SS"></input>
                </div>
                <div className="SetButton">
                    <button onClick={handleSetButton}>Set</button>
                </div>
            </div>
        );
    }

    // Handlers
    const handleClockUpdate = (update: any) => {
        if (update.type === "StartStop") {setIsRunning(update.runningBool)}
        else if (update.type === "ClockSet") {alert('ClockSet type object returned.')}
        else {alert('Neither type detected.')}
    };
    const handleEditButton = (e:any) => {
        e.preventDefault();
        setEditTimeShow(!editTimeShow)
    }
    const handleSetButton = () => {
        setEditTimeShow(false);
        socket.emit('ScenarioClock',{type:"ClockSet"});
    }
    const handleStartStopButton = (e:any) => {
        e.preventDefault();
        socket.emit('ScenarioClock',{type:"StartStop",runningBool:!isRunning});
    }

    // Handle Clock Status Update
    useEffect(() => {
        socket.on('ScenarioClockAPI', handleClockUpdate);
        return () => {
            socket.off('ScenarioClockAPI').off();
        } // This was returning the alert case twice, so adding socket.off as seen solved the problem
    }, [socket]);

    // Handle Clock Display increments
    const updateTime = () => {
        let time = new Date().toUTCString();
        setScenarioTime(time);
    };
    useEffect(()=> {
        if (isRunning) {intervalID = setInterval(updateTime, 1000/*ms*/);}
        return () => clearInterval(intervalID);
    },[isRunning])

    if (ewok.team === "Instructor") {
        return (
            <div className="ScenarioClock">
                <div className="ScenarioClockTime">Scenario Time: {scenarioTime.substring(17,25)}</div>
                <div className="ScenarioClockButtons">
                    <div className="ScenarioClockButtonSet"><button onClick={handleEditButton}>Edit</button></div>
                    <div className="ScenarioClockButtonStartStop"><button onClick={handleStartStopButton}>{ isRunning ? 'Stop' : 'Start' }</button></div>
                </div>
                {editTimeShow ? <TimeSetForm /> : null}
            </div>
        )
    }
    
    else {
        return (
            <div className="ScenarioClock">Scenario Time: {scenarioTime.substring(17,25)}</div>
            
        )
    }
}

export default ScenarioClock;
