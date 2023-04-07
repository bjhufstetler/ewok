import React from "react";
import { useState, useEffect } from 'react';
import { useEwokContext } from "../../../context/EwokContext";
import './ScenarioClock.css';


const ScenarioClock = () => {
    let time = new Date();
    let intervalID:any;

    const {socket, ewok}                    = useEwokContext();
    const [isRunning, setIsRunning]         = useState<boolean>(false);
    const [editTimeShow, setEditTimeShow]   = useState<boolean>(false);
    const [hhInputBad, setHHInputBad]       = useState<boolean>(false);
    const [mmInputBad, setMMInputBad]       = useState<boolean>(false);
    const [ssInputBad, setSSInputBad]       = useState<boolean>(false);
    const [scenarioTime, setScenarioTime]   = useState(time);
    const [tmpScenTime, setTmpScenTime]     = useState({HH:0,MM:0,SS:0});       
    const [deltaT, setDeltaT]               = useState({HH:0,MM:0,SS:0});              
    
    
    const handleClockUpdate = (update: any) => {
        // Parses out any messages sent over the socket
        // Necessary because instructor and student clocks are the same component

        if (update.type === "StartStop") {
            setIsRunning(update.runningBool);
            setDeltaT(update.timeDeltaT);
        }
        else if (update.type === "ClockSet") {
            let newDate = new Date();
            newDate.setHours(update.emitTimeSet.HH);
            newDate.setMinutes(update.emitTimeSet.MM);
            newDate.setSeconds(update.emitTimeSet.SS);
            setScenarioTime(newDate);
        }
        else {alert("Socket Transmit format not accepted.")}
    };

    const updateTime = () => {
        // Sets Scenario Time, serves to change the clock each second in accordance
        // with the most recent deltaT sent over the socket

        let time = new Date();
        time.setHours(time.getHours()-deltaT.HH);
        time.setMinutes(time.getMinutes()-deltaT.MM);
        time.setSeconds(time.getSeconds()-deltaT.SS);
        setScenarioTime(time);
        setTmpScenTime({HH:time.getHours(), MM:time.getMinutes(), SS: time.getSeconds()})
    };

    const handleEditButton = (e:any) => {
        // "Opens" the Edit display

        e.preventDefault();
        setEditTimeShow(!editTimeShow)
    }

    const handleStartStopButton = (e:any) => {
        // Transmits a new DeltaT value each time Start is pressed so that the 
        // displayed clock does not reset based on new date calculation

        e.preventDefault();
        let tmpDelT = {HH:0, MM:0, SS:0};
        if (!isRunning) {
            // Calculate and Set a delta T
            let tmpHH = new Date().getHours();
            let tmpMM = new Date().getMinutes();
            let tmpSS = new Date().getSeconds();
            tmpDelT = {HH: tmpHH - tmpScenTime.HH, MM: tmpMM - tmpScenTime.MM, SS: tmpSS - tmpScenTime.SS}
        }
        socket.emit('ScenarioClock',{type:"StartStop", runningBool:!isRunning, timeDeltaT: tmpDelT});
        console.log('Generated new DelT'+JSON.stringify(tmpDelT))
    }

    const handleSetButton = () => {
        // Hides Edit display, gives error message if clock is running, and
        // sends new scenario time to other users

        if (isRunning) {
            alert('You must have the scenario clock stopped in order to change the scenario time.');
            return;
        }
        setEditTimeShow(false);
        setTmpScenTime({...tmpScenTime, SS:0})
        socket.emit('ScenarioClock',{type:"ClockSet",emitTimeSet:{...tmpScenTime,SS:0}});
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

    // Handle Socket Pings
    useEffect(() => {
        // Listens for any changes over the socket then sends messages to
        // handleClockUpdate above in order to be parsed

        socket.on('ScenarioClockAPI', handleClockUpdate);
        return () => {
            socket.off('ScenarioClockAPI').off();
        }
    }, [socket]);

    useEffect(()=> {
        // Updates the clock once a second using the updateTime function above, 
        // or stops it if isRunning is made False via clicking Stop

        if (isRunning) {intervalID = setInterval(updateTime, 1000/*ms*/);}
        return () => clearInterval(intervalID);
    },[isRunning])



    // Edit Display
    const TimeSetForm = () => {
        return (
            <div className="timeInput">
                <div className="TIBox">
                    <input type="text" 
                        placeholder="HH" 
                        onInput={e => handleHHChange(e)} 
                        className={hhInputBad ? "BadTimeInput" : ""}>
                    </input> : 
                    <input type="text" 
                        placeholder="MM" 
                        onChange={e => handleMMChange(e)} 
                        className={mmInputBad ? "BadTimeInput" : ""}>
                    </input> {/*}: 
                    <input type="text" 
                        placeholder="SS" 
                        onChange={e => handleSSChange(e)} 
                        className={ssInputBad ? "BadTimeInput" : ""}>
                    </input>*/}
                </div>
                <div className="SetButton">
                    <button onClick={handleSetButton}>Set</button>
                </div>
            </div>
        );
    }

    // Show one version for anyone logged in as instructor
    if (ewok.team === "Instructor") {
        return (
            <div className="ScenarioClock">
                <div className="ScenarioClockTime">Scenario: {scenarioTime.toString().substring(16,25)}</div>
                <div className="ScenarioClockButtons">
                    <div className="ScenarioClockButtonSet"><button onClick={handleEditButton}>Edit</button></div>
                    <div className="ScenarioClockButtonStartStop"><button onClick={handleStartStopButton}>{ isRunning ? 'Stop' : 'Start' }</button></div>
                </div>
                {editTimeShow ? TimeSetForm() : null}
            </div>
        )
    }
    
    // Show only the scenario time for anyone not logged in as the instructor
    else {
        return (
            <div className="ScenarioClock">Scenario: {scenarioTime.toString().substring(16,25)}</div>
        )
    }
}

export default ScenarioClock;
