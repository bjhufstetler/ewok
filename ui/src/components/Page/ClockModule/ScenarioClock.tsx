import React from "react";
import { useState, useEffect } from 'react';
import { useEwokContext } from "../../../context/EwokContext";
import '../Header.css';

// TODO: Find a way to get around the async nature of use State such that the correct boolean will emit on start/stop



const ScenarioClock = () => {
    //let time = new Date().toUTCString();
    let intervalID:any;

    const {socket, ewok} = useEwokContext();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [scenarioTime, setScenarioTime] = useState<number>(0);
    const [editTimeShow, setEditTimeShow] = useState<boolean>(false);

    // This is just to show the EWOK context current details at each page for debug purposes
    console.log("Server: "+ewok.server)
    console.log("BaseURL: "+ewok.baseURL)
    console.log("Team: "+ewok.team)

    // Edit Popup Form
    const TimeSetForm = () => {
        return (
            <div>
                <div className="timeInput">
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
        if (update.type === "StartStop") {setIsRunning(update.runningBool);setScenarioTime(update.timeKey)}
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
        socket.emit('ScenarioClock',{type:"StartStop",runningBool:!isRunning,timeKey:scenarioTime});
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
        //let time = new Date().toUTCString();
        setScenarioTime(scenarioTime === 86399 ? 0 : scenarioTime => scenarioTime+1);
    };
    useEffect(()=> {
        if (isRunning) {intervalID = setInterval(updateTime, 1000/*ms*/);}
        return () => clearInterval(intervalID);
    },[isRunning])

    if (ewok.team === "Instructor") {
        return (
            <div className="ScenarioClock">
                <div className="ScenarioClockTime">Scenario Time: {scenarioTime.toString()} {isRunning.toString()}</div>
                <div className="ScenarioClockButtons">
                    <div className="ScenarioClockButtonSet"><button onClick={handleEditButton}>Edit</button>{editTimeShow.toString()}</div>
                    <div className="ScenarioClockButtonStartStop"><button onClick={handleStartStopButton}>{ isRunning ? 'Stop' : 'Start' }</button></div>
                </div>
                <div className="timeInput">{editTimeShow ? <TimeSetForm /> : null}</div>
            </div>
        )
    }
    //scenarioTime.substring(17,25)
    else {
        return (
            <div className="ScenarioClockTime">Scenario Time: {scenarioTime.toString()} {isRunning.toString()}</div>
            
        )
    }
}

export default ScenarioClock;
