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
    const [tmpScenTime, setTmpScenTime] = useState({HH:0,MM:0,SS:0});
    const [deltaT, setDeltaT] = useState(0);
    const [hhInputBad, setHHInputBad] = useState<boolean>(false);
    const [mmInputBad, setMMInputBad] = useState<boolean>(false);
    const [ssInputBad, setSSInputBad] = useState<boolean>(false);

    // This is just to show the EWOK context current details at each page for debug purposes
    console.log("Server: "+ewok.server)
    console.log("BaseURL: "+ewok.baseURL)
    console.log("Team: "+ewok.team)

    // Edit Popup Form
    const TimeSetForm = () => {
        return (
            <div className="timeInput">
                <div className="TIBox">
                    <input type="text" placeholder="HH" onInput={e => handleHHChange(e)} className={hhInputBad ? "BadTimeInput" : ""}></input>:
                    <input type="text" placeholder="MM" onChange={e => handleMMChange(e)} className={mmInputBad ? "BadTimeInput" : ""}></input>:
                    <input type="text" placeholder="SS" onChange={e => handleSSChange(e)} className={ssInputBad ? "BadTimeInput" : ""}></input>
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

    // Handle time inputs
    const handleHHChange = (e:any) => {
        let input = parseInt(e.target.value);
        if (!isNaN(input)) {
            if (input >= 0 && input < 24) {
                const tmpClock = {
                    ...tmpScenTime,
                    HH: input
                }
                setTmpScenTime(tmpClock);
                setHHInputBad(false);
            } else {setHHInputBad(true)}
        } else {setHHInputBad(true)}  
    }
    const handleMMChange = (e:any) => {
        let input = parseInt(e.target.value);
        if (!isNaN(input)) {
            if (input >= 0 && input < 60) {
                const tmpClock = {
                    ...tmpScenTime,
                    MM: input
                }
                setTmpScenTime(tmpClock);
                setMMInputBad(false);
            } else {setMMInputBad(true)}
        } else {setMMInputBad(true)} 
    }
    const handleSSChange = (e:any) => {
        let input = parseInt(e.target.value);
        if (!isNaN(input)) {
            if (input >= 0 && input < 60) {
                const tmpClock = {
                    ...tmpScenTime,
                    SS: input
                }
                setTmpScenTime(tmpClock);
                setSSInputBad(false);
            } else {setSSInputBad(true)}
        } else {setSSInputBad(true)}
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

    // /Scenario Time: {scenarioTime.substring(17,25)}
    if (ewok.team === "Instructor") {
        return (
            <div className="ScenarioClock">
                <div className="ScenarioClockTime">{JSON.stringify(tmpScenTime)}</div>
                <div className="ScenarioClockButtons">
                    <div className="ScenarioClockButtonSet"><button onClick={handleEditButton}>Edit</button></div>
                    <div className="ScenarioClockButtonStartStop"><button onClick={handleStartStopButton}>{ isRunning ? 'Stop' : 'Start' }</button></div>
                </div>
                {editTimeShow ? TimeSetForm() : null}
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
