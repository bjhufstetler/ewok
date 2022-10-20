import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import { useEwokContext } from '../../context/EwokContext';

const Satellites = () => {
    const { ewok } = useEwokContext();
    const [signals, setSignals] = useState<signals[]>([]);
    
        
    useEffect(() => {
        let tmpSignals = [...signals];
        let tmpSatEnv = [...ewok.satEnv];

        tmpSignals = [
            {team: "All", x: 12000, y: -100, sat: 'Satellite A'},
            {team: "All", x: 12000, y: -100, sat: 'Satellite B'},
            {team: "All", x: 12000, y: -100, sat: 'Satellite C'}];
        
        if ( tmpSatEnv.length > 0 ) {
            tmpSatEnv.sort((a, b) => a.cf - b.cf).map(signal => {
                tmpSignals.push({team: signal.team, x: signal.cf - signal.bw / 2, y: signal.power, sat: signal.sat});
                tmpSignals.push({team: signal.team, x: signal.cf + signal.bw / 2, y: -100, sat: signal.sat});
            });
        };
        [{team: "All", x: 13000, y: -100, sat: 'Satellite A'},
            {team: "All", x: 13000, y: -100, sat: 'Satellite B'},
            {team: "All", x: 13000, y: -100, sat: 'Satellite C'}].forEach(signal => {
                tmpSignals.push(signal)
            });

        setSignals(tmpSignals);  
    }, [ewok]);
    
    const SatEnvPlot = ({ sat } : { sat: string}) => {
        return(
            <>
                <div>{sat}</div>
                <div>
                    <Plot
                        data = {[{team: "Victor", color: "#fa7970"},
                                 {team: "Whiskey", color: "#faa356"},
                                 {team: "Xray", color: "#7ce38b"},
                                 {team: "Yankee", color: "#a2d2fb"},
                                 {team: "Zulu", color: "#cea5fb"},
                                 {team: "Instructor", color: "white"},].map( team => (
                            {
                                x: signals.filter(signal => (signal.team == team.team || signal.team == "All") && signal.sat == sat).map(signal => signal.x) as Array<number>,
                                y: signals.filter(signal => (signal.team == team.team || signal.team == "All") && signal.sat == sat).map(signal => signal.y) as Array<number>,
                                type: 'scatter', mode: 'lines', name: team.team,
                                line: { shape: 'hv', width: 1, color: team.color }
                            }
                        ))}
                        layout = { 
                            {
                                width: 1200, height: 240, plot_bgcolor: "#2e292b", paper_bgcolor: "#2e292b",
                                margin: { l: 55, r: 10, b: 40, t: 10, pad: 1 },
                                xaxis: { title: 'MHz', color: 'white' , range: [12000, 13000] },
                                yaxis: { title: 'dB', color: 'white' , fixedrange: true, range: [-101, -83] },
                                font: { color: 'white'}
                            }
                        }
                        
                    />
                </div>
            </>
        );
    };
    
    return(
        <>
            <SatEnvPlot key="A'" sat = {"Satellite A"} />
            <SatEnvPlot key="B'" sat = {"Satellite B"} />
            <SatEnvPlot key="C'" sat = {"Satellite C"} />
        </>
    )
};

export default Satellites;

interface satEnv {
    team: string, 
    cf: number, 
    bw: number, 
    power: number, 
    sat: string
};

interface signals {
    team?: string;
    x?: number;
    y?: number;
    sat?: string;
};