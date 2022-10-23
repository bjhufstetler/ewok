import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import { useEwokContext } from '../../context/EwokContext';

const Satellites = () => {
    const { ewok } = useEwokContext();
    const [signals, setSignals] = useState<signals[]>([]);
    
        
    useEffect(() => {
        let tmpSatEnv = [...ewok.satEnv].filter(x => x.server == ewok.server && x.stage == "ULRF");

        let tmpSignals = [
            {team: "All", x: 5000, y: -100, sat: 'Satellite A'},
            {team: "All", x: 5000, y: -100, sat: 'Satellite B'},
            {team: "All", x: 5000, y: -100, sat: 'Satellite C'}];
        
        if ( tmpSatEnv.length > 0 ) {
            tmpSatEnv.sort((a, b) => a.cf - b.cf).map(signal => {
                tmpSignals.push({team: signal.team, x: signal.cf - signal.bw / 2, y: signal.power, sat: signal.sat});
                tmpSignals.push({team: signal.team, x: signal.cf + signal.bw / 2, y: -100, sat: signal.sat});
            });
        };

        [{team: "All", x: 32000, y: -100, sat: 'Satellite A'},
        {team: "All", x: 32000, y: -100, sat: 'Satellite B'},
        {team: "All", x: 32000, y: -100, sat: 'Satellite C'}].forEach(signal => {
            tmpSignals.push(signal)
        });

        setSignals(tmpSignals);  
    }, [ewok]);
    
    const SatEnvPlot = ({ sat, lb, ub } : { sat: string, lb: number, ub: number}) => {
        const teamData : Array<{team: string, color: string}> = [
            {team: "Victor", color: "#fa7970"},
            {team: "Whiskey", color: "#faa356"},
            {team: "Xray", color: "#7ce38b"},
            {team: "Yankee", color: "#a2d2fb"},
            {team: "Zulu", color: "#cea5fb"},
            {team: "Instructor", color: "white"}]

        let plotData : Array<any> = teamData.map( team => {
            const teamSignals = signals?.filter(signal => (signal.team == team.team || signal.team == "All") && signal.sat == sat);
            return({
                x: teamSignals.map(signal => signal.x) as Array<number>,
                y: teamSignals.map(signal => signal.y) as Array<number>,
                type: 'scatter', mode: 'lines', name: team.team,
                line: { shape: 'hv', width: 1, color: team.color },
                fill: 'toself', hoveron: 'points+fills', opacity: 0.6,
            });
        });

        ewok.satEnv.filter(signal => signal.sat == sat && signal.server == ewok.server).map(signal => {
            const teamIndex = teamData.map(x => x.team).indexOf(signal.team);
            const teamColor = teamData[teamIndex].color;
            plotData.push({
                x: [signal.cf],
                y: [-100 + 13 * Math.random()],
                mode: 'text',
                text: String(signal.cf / 1000) + " GHz",
                textfont: { color: teamColor},
                showlegend: false 
            });
        });

        plotData.push({
            x: [5000, 5000, lb, lb],
            y: [-100, -85, -85, -100],
            mode: 'lines',
            line: {color: '#797878'},
            fill: 'toself', fillcolor: '#797878', opacity: 0.4,
            showlegend: false,
            hoveron: 'fill',
            name: 'No Signal'
        },{
            x: [ub, ub, 32000, 32000],
            y: [-100, -85, -85, -100],
            mode: 'lines',
            line: {color: '#797878'},
            fill: 'toself', fillcolor: '#797878', opacity: 0.4,
            showlegend: false,
            hoveron: 'fill',
            name: 'No Signal'
        });

        return(
            <>
                <div>{sat}</div>
                <div>
                    <Plot
                        data = {plotData}
                        layout = { 
                            {
                                width: 1200, height: 240, plot_bgcolor: "#2e292b", paper_bgcolor: "#2e292b",
                                margin: { l: 55, r: 10, b: 40, t: 10, pad: 1 },
                                xaxis: { title: 'MHz', color: 'white' , range: [lb, ub] },
                                yaxis: { title: 'dB', color: 'white' , fixedrange: true, range: [-101, -83] },
                                font: { color: 'white'}, legend: { y: 0 },
                                modebar: {remove: ['zoomIn2d', 'zoomOut2d', 'resetScale2d', 'toImage', 'lasso2d', 'select2d']}
                            }   
                        }
                        
                    />
                </div>
            </>
        );
    };
    
    return(
        <>
            <SatEnvPlot key="A'" sat = {"Satellite A"} lb = {6000} ub={7000}/>
            <SatEnvPlot key="B'" sat = {"Satellite B"} lb = {12000} ub={13000}/>
            <SatEnvPlot key="C'" sat = {"Satellite C"} lb = {30000} ub={31000}/>
        </>
    )
};

export default Satellites;

interface signals {
    team?: string;
    x?: number;
    y?: number;
    sat?: string;
};