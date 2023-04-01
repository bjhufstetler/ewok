import React from "react";
import { useState, useEffect } from 'react';
import { useEwokContext } from "../../../context/EwokContext";

const ScenarioClock = () => {

    const {socket, ewok} = useEwokContext();
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // This is just to show the EWOK context current details at each page for debug purposes
    console.log("Server: "+ewok.server)
    console.log("BaseURL: "+ewok.baseURL)
    console.log("Team: "+ewok.team)

    // Structure of update and prop is 
    //{
    //    
    //    TYPE: StartStop or ClockSet (dT calc'd locally)
    //    If StartStop, then will have isRunning var, true if start, false if stop
    //    If ClockSet, then will have time to set it to, then will have time
    //    IR: true or false for is running or not
    //    ClockSet: true or false for whether or not clock is being set
    //    StartStop: string of "start" or "stop" to denote what to do
    //    dT: number or something for amount to adjust zulu time by
    //}

    // Handlers
    const handleClockUpdate = (update: any) => {
        // alert("The string was "+update.message);
        // console.log(update); 
        if (update.type === "StartStop") {
            //alert('StartStop type object returned.');
            if (update.runningBool) {setIsRunning(true)}
            else if (!update.runningBool) {setIsRunning(false)}
        }
        else if (update.type === "ClockSet") {alert('ClockSet type object returned.')}
        else {alert('Neither type detected.')}

    };
    const handleSetButton = (e:any) => {
        e.preventDefault();
        socket.emit('ScenarioClock',{type:"ClockSet"});
    }
    const handleStartButton = (e:any) => {
        e.preventDefault();
        socket.emit('ScenarioClock',{type:"StartStop",runningBool:true});
    }
    const handleStopButton = (e:any) => {
        e.preventDefault();
        socket.emit('ScenarioClock',{type:"StartStop",runningBool:false});
    }

    // Handle Clock Status Update
    useEffect(() => {
        socket.on('ScenarioClockAPI', handleClockUpdate);
        return () => {
            socket.off('ScenarioClockAPI').off();
        } // This was returning the alert case twice, so adding socket.off as seen solved the problem
    }, [socket]);

    if (ewok.team === "Instructor") {
        return (
            <div>
                <div className="ScenarioClockText">Running: {isRunning.toString()}</div>
                <div className="ScenarioClockButtons">
                    <div className="ScenarioClockButtonSet"><button onClick={handleSetButton}>Set</button></div>
                    <div className="ScenarioClockButtonStart"><button onClick={handleStartButton}>Start</button></div>
                    <div className="ScenarioClockButtonStop"><button onClick={handleStopButton}>Stop</button></div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <div className="ScenarioClockText">Running: {isRunning.toString()}</div>
            </div>
        )
    }
}

export default ScenarioClock;
