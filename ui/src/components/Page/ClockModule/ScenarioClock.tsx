import React from "react";
import { useState, useEffect } from 'react';
import { useEwokContext } from "../../../context/EwokContext";

const ScenarioClock = () => {

    const {socket, ewok} = useEwokContext();

    // This is just to show the EWOK context current details at each page for debug purposes
    console.log("Server: "+ewok.server)
    console.log("BaseURL: "+ewok.baseURL)
    console.log("Team: "+ewok.team)

    // Handlers
    const handleClockUpdate = (update: any) => {
        alert("The string was "+update.message);
        console.log(update); 
    };

    const handleClockButton = (e:any) => {
        e.preventDefault();
        socket.emit('ScenarioClock',{message:"\"How many times will it show?\""});
    }

    // Handle Clock Status Update
    useEffect(() => {
        socket.on('ScenarioClockAPI', handleClockUpdate);
        return () => {
            socket.off('ScenarioClockAPI').off();
        } // This was returning the alert case twice, so adding socket.off as seen solved the problem
    }, [socket]);


    return (
        <div><button onClick={handleClockButton}>Test</button></div>
    )
}

export default ScenarioClock;
