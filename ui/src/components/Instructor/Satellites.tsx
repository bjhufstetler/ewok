import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';

const Satellites = () => {
    const satEnv = [
        {team: 'Instructor', cf: 12550, bw: 25, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12250, bw: 2, amp: -92, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12150, bw: 3, amp: -95, sat: 'Satellite B'},
        {team: 'Instructor', cf: 12350, bw: 4, amp: -93, sat: 'Satellite C'},
        {team: 'Victor', cf: 12550, bw: 30, amp: -88, sat: 'Satellite A'},
        {team: 'Victor', cf: 12750, bw: 10, amp: -87, sat: 'Satellite B'},
        {team: 'Whiskey', cf: 12550, bw: 30, amp: -88, sat: 'Satellite A'},
        {team: 'Whiskey', cf: 12550, bw: 30, amp: -88, sat: 'Satellite B'},
        {team: 'Xray', cf: 12550, bw: 30, amp: -88, sat: 'Satellite C'},
        {team: 'Yankee', cf: 12850, bw: 30, amp: -88, sat: 'Satellite A'},
        {team: 'Zulu', cf: 12200, bw: 30, amp: -88, sat: 'Satellite B'},
    ];

    const [signals, setSignals] = useState([]);
    
    
    useEffect(() => {
        if( signals.length == 0 ) {
            let tmpSignals = [
                {team: "All", x: 12000, y: -100, sat: 'Satellite A'},
                {team: "All", x: 13000, y: -100, sat: 'Satellite A'},
                {team: "All", x: 12000, y: -100, sat: 'Satellite B'},
                {team: "All", x: 13000, y: -100, sat: 'Satellite B'},
                {team: "All", x: 12000, y: -100, sat: 'Satellite C'},
                {team: "All", x: 13000, y: -100, sat: 'Satellite C'}];
            satEnv.sort((a, b) => a.cf - b.cf).map(signal => {
                tmpSignals.push({team: signal.team, x: signal.cf - signal.bw / 2, y: signal.amp, sat: signal.sat});
                tmpSignals.push({team: signal.team, x: signal.cf + signal.bw / 2, y: -100, sat: signal.sat});
            });
            setSignals(tmpSignals);
            console.log('fire');
        };
    }, []);

    useEffect(() => {
        console.log(signals.filter(signal => signal.team == "Instructor").map(x => x.x));
    }, [signals]);

    const SatEnvPlot = (props) => {
        return(
            <>
                <div>{props.sat}</div>
                <div>
                    <Plot
                        data = {[
                            {
                                x: signals.filter(signal => (signal.team == "Victor" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.x),
                                y: signals.filter(signal => (signal.team == "Victor" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.y),
                                type: 'scatter', mode: 'lines', name: 'Victor',
                                line: { shape: 'hv', width: 3, color: 'red' }
                            },
                            {
                                x: signals.filter(signal => (signal.team == "Whiskey" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.x),
                                y: signals.filter(signal => (signal.team == "Whiskey" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.y),
                                type: 'scatter', mode: 'lines', name: 'Whiskey',
                                line: { shape: 'hv', width: 1, color: 'orange' }
                            },
                            {
                                x: signals.filter(signal => (signal.team == "Xray" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.x),
                                y: signals.filter(signal => (signal.team == "Xray" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.y),
                                type: 'scatter', mode: 'lines', name: 'Xray',
                                line: { shape: 'hv', width: 1, color: 'yellow' }
                            },
                            {
                                x: signals.filter(signal => (signal.team == "Yankee" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.x),
                                y: signals.filter(signal => (signal.team == "Yankee" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.y),
                                type: 'scatter', mode: 'lines', name: 'Yankee',
                                line: { shape: 'hv', width: 1, color: 'green' }
                            },
                            {
                                x: signals.filter(signal => (signal.team == "Zulu" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.x),
                                y: signals.filter(signal => (signal.team == "Zulu" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.y),
                                type: 'scatter', mode: 'lines', name: 'Zulu',
                                line: { shape: 'hv', width: 1, color: 'blue' }
                            },
                            {
                                x: signals.filter(signal => (signal.team == "Instructor" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.x),
                                y: signals.filter(signal => (signal.team == "Instructor" | signal.team == "All") && signal.sat == props.sat).map(signal => signal.y),
                                type: 'scatter', mode: 'lines', name: 'Instructor',
                                line: { shape: 'hv', width: 1, color: 'white' }
                            }
                        ]}
                        layout = { 
                            {
                                color: 'white', width: 820, height: 240, plot_bgcolor: "#2e292b", paper_bgcolor: "#2e292b",
                                margin: { l: 55, r: 10, b: 40, t: 10, pad: 1 },
                                xaxis: { title: 'MHz', color: 'white', range: [12000, 13000] },
                                yaxis: { title: 'dB', color: 'white', fixedrange: true, range: [-101, -83] },
                                font: { color: 'white' }
                            }
                        }
                        
                    />
                </div>
            </>
        );
    };
    
    return(
        <>
            <SatEnvPlot key="a'" sat = {"Satellite A"} />
            <SatEnvPlot key="a'" sat = {"Satellite B"} />
            <SatEnvPlot key="a'" sat = {"Satellite C"} />
        </>
    )
};

export default Satellites;