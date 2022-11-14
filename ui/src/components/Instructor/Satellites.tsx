import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import { useEwokContext, useSatEnvContext } from '../../context/EwokContext';

const Satellites = () => {
    const { satellites } = useEwokContext();
    const { satEnv } = useSatEnvContext();
    const [signals, setSignals] = useState<signals[]>([]);

    useEffect(() => {
        let tmpSatEnv = satEnv;
        let tmpSignals = [
            {team: "All", x: 5000, y: -100, sat: 'ASH'},
            {team: "All", x: 5000, y: -100, sat: 'DRSC'},
            {team: "All", x: 5000, y: -100, sat: 'ArCOM'}];
        
        if ( tmpSatEnv.length > 0 ) {
            tmpSatEnv.sort((a, b) => a.cf - b.cf).filter(x => x.team === 'Instructor' || x.active ).map(signal => {
                const power = signal.power * (1 + (1 / (10 * signal.mod)) + ( 1 / (10 * signal.fec))) - 2;
                const uc = signal.team === 'Instructor' ? satellites.filter(x => x.sat === signal.sat)[0]?.uc : satellites.filter(x => x.band === signal.band)[0]?.uc;
                const bw = signal.dr * (1 + 1/signal.fec) / ( signal.mod * 2 );
                tmpSignals.push({team: signal.team, x: signal.cf + uc - bw, y: power, sat: signal.sat});
                tmpSignals.push({team: signal.team, x: signal.cf + uc + bw, y: -100, sat: signal.sat});
                return(null);
            });
        };

        [{team: "All", x: 32000, y: -100, sat: 'ASH'},
        {team: "All", x: 32000, y: -100, sat: 'DRSC'},
        {team: "All", x: 32000, y: -100, sat: 'ArCOM'}].forEach(signal => {
            tmpSignals.push(signal)
        });

        setSignals(tmpSignals);  
        console.log('heard socket.emit')
    }, [satEnv]);
    
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
        /*
        satEnv.filter((signal : any) => signal.sat == sat ).map((signal : any, signalID: any) => {
            const uc = signal.team == 'Instructor' ? satellites.filter(x => x.sat == signal.sat)[0]?.uc : satellites.filter(x => x.band == signal.band)[0]?.uc;
            const teamIndex = teamData.map(x => x.team).indexOf(signal.team);
            const teamColor = teamData[teamIndex].color;
            const mod = signal.mod == 1 ? 'BPSK' : 'QPSK'
            const fec = signal.fec == 1 ? '1/2' : signal.fec == 3 ? '3/4' : '7/8'
            plotData.push({
                x: [signal.cf + uc],
                y: [-100 + 10 * (1 + Number(signalID))],
                mode: 'text',
                text: String(signal.cf / 1000) + " GHz",
                textfont: { color: teamColor},
                showlegend: false 
            });
            plotData.push({
                x: [signal.cf + uc],
                y: [-100 + 10 * (1 + Number(signalID)) - 5],
                mode: 'text',
                text: `${String(signal.dr)} MHz | ${mod} ${fec}`,
                textfont: { color: teamColor},
                showlegend: false 
            });
        });
        */
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
                                yaxis: { title: 'dB', color: 'white'},
                                font: { color: 'white'}, legend: { y: 0 },
                                modebar: {remove: ['zoomIn2d', 'zoomOut2d', 'resetScale2d', 'toImage', 'lasso2d']}
                            }   
                        }
                        
                    />
                </div>
            </>
        );
    };
    
    return(
        <>
            <SatEnvPlot key="A'" sat = {"ASH"} lb = {6000} ub={7000}/>
            <SatEnvPlot key="B'" sat = {"DRSC"} lb = {12000} ub={13000}/>
            <SatEnvPlot key="C'" sat = {"ArCOM"} lb = {30000} ub={31000}/>
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