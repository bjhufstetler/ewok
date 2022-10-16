import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';

const Satellites = () => {
    interface satEnv {
        team?: string, 
        cf?: number, 
        bw?: number, 
        amp?: number, 
        sat?: string
    }

    interface signals {
        team?: string;
        x?: number;
        y?: number;
        sat?: string;
    }

    const satEnv = [
        {team: 'Instructor', cf: 12550, bw: 25, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12560, bw: .5, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12565, bw: .5, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12566, bw: .5, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12567, bw: .5, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12568, bw: .5, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12570, bw: .5, amp: -90, sat: 'Satellite A'},
        {team: 'Instructor', cf: 12575, bw: 5, amp: -90, sat: 'Satellite A'},
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

    const [signals, setSignals] = useState<signals[]>([]);
    
    
    useEffect(() => {
        if( signals.length == 0 ) {
            let tmpSignals = [
                {team: "All", x: 12000, y: -100, sat: 'Satellite A'},
                {team: "All", x: 12000, y: -100, sat: 'Satellite B'},
                {team: "All", x: 12000, y: -100, sat: 'Satellite C'}];

            satEnv.sort((a, b) => a.cf - b.cf).map(signal => {
                tmpSignals.push({team: signal.team, x: signal.cf - signal.bw / 2, y: signal.amp, sat: signal.sat});
                tmpSignals.push({team: signal.team, x: signal.cf + signal.bw / 2, y: -100, sat: signal.sat});
            });
            
            [{team: "All", x: 13000, y: -100, sat: 'Satellite A'},
             {team: "All", x: 13000, y: -100, sat: 'Satellite B'},
             {team: "All", x: 13000, y: -100, sat: 'Satellite C'}].forEach(signal => {
                tmpSignals.push(signal)
             });

            setSignals(tmpSignals);
        };
    }, []);

    useEffect(() => {
        console.log(signals.filter(signal => signal.team == "Instructor").map(x => x.x));
    }, [signals]);
    
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