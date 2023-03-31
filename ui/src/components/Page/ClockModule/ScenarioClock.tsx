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
        alert('Ping went through Scenario Clock Socket' + '\nThe string was '+update.message);  
        console.log(update); 

    };

    const handleClockButton = (e:any) => {
        e.preventDefault();
        socket.emit('ScenarioClock',{message:"Clock Test"});
    }

    // Handle Clock Status Update
    useEffect(() => {
        socket.on('ScenarioClockAPI', handleClockUpdate);
        
    }, [socket]);


    return (
        <div><button onClick={handleClockButton}>Test</button></div>
    )
}

export default ScenarioClock;
