import { useEwokContext } from "../../context/EwokContext";
import { useEffect, useState } from 'react';
import './StudentPage.css'
import Plot from 'react-plotly.js';

const SpecA = ({ unit_name } : { unit_name: string}) => {
    const { ewok, setEwok } = useEwokContext();
    const ewokSpecA = ewok.equipment.filter(x => 
        x.team == ewok.team && 
        x.server == ewok.server && 
        x.unit_type == "SpecA" && 
        x.unit_name == unit_name
        )[0];

    const [specAState, setSpecAState] = useState({
        id: 0, 
        conn: '', 
        server: '', 
        team: '', 
        unit_type: 'SpecA', 
        unit_name: '1', 
        cf: 6500, 
        bw: 1000, 
        power: 0, 
        sat: 'ULRF', 
        feed: '', 
        active: true
    });
    useEffect(() => {
        const tmpSpecAState = ewok.equipment.filter(x => 
            x.team == ewok.team && 
            x.server == ewok.server && 
            x.unit_type == "SpecA" && 
            x.unit_name == unit_name
            )[0];
        
        setSpecAState(tmpSpecAState)
    }, [ewok]);
    const handleChangeCF = (e: any) => {
        let tmpSpecAState = {
            ...specAState,
            cf: Number(e.target.value)
        };
        setSpecAState(tmpSpecAState);
    };
    const handleChangeBW = (e: any) => {
        let tmpSpecAState = {
            ...specAState,
            bw: Number(e.target.value)
        };
        setSpecAState(tmpSpecAState);
    };
    const handleClickSet = () => {
        let tmpEquipment = ewok.equipment;
        const equipmentIndex = tmpEquipment.map(x => x.id).indexOf(specAState.id);
        tmpEquipment[equipmentIndex] = specAState;
        setEwok({
            ...ewok,
            equipment: tmpEquipment
        });
    };

    const SpecAPlot = () => {
        const plotXRange = [ewokSpecA?.cf - ewokSpecA?.bw / 2, ewokSpecA?.cf + ewokSpecA?.bw / 2]
        const plotX : Array<number> = Array(1000).fill(0).map((_, idx) => idx * (plotXRange[1] - plotXRange[0]) / 1000 + plotXRange[0])
        let plotY : Array<number> = [];
        plotX.map(x => {
            let signalPower = ewok.satEnv.filter(env => 
                env.server == ewok.server &&
                env.cf - env.bw / 2 <= x &&
                env.cf + env.bw / 2 >= x).map(signal => signal.power)
            signalPower.push(-100)
            plotY.push(Math.max(...signalPower) - 1 + 2 * Math.random());
        })
        const plotData = [{
            x: plotX,
            y: plotY
        }];
        /*
            TODO: Max hold, saved states, antenna selection, rf/if, ul/dl, updates every 1/nth of a second
            consider putting this in context.
        */
        console.log(specAState)
        return(
            <>
                <div>Spectrum Analyzer {unit_name}</div>
                <div>
                    <Plot
                        data = {plotData}
                        layout = { 
                            {
                                width: 800, height: 240, plot_bgcolor: "#2e292b", paper_bgcolor: "#2e292b",
                                margin: { l: 55, r: 10, b: 40, t: 10, pad: 1 },
                                xaxis: { 
                                    title: 'MHz',
                                    color: 'white',
                                    range: [ewokSpecA?.cf - ewokSpecA?.bw / 2, ewokSpecA?.cf + ewokSpecA?.bw / 2],
                                    fixedrange: true
                                },
                                yaxis: { title: 'dB', color: 'white', fixedrange : true, range: [-101, -83]},
                                font: { color: 'white'}, legend: { y: 0 },
                                modebar: {remove: ["autoScale2d", 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'pan2d', 'resetScale2d', 'toImage']},
                                dragmode: 'select'
                            }   
                        }
                        
                    />
                </div>
            </>
        );
    }
    return(
        <div className='SpecA'>
            <SpecAPlot />
            <span>Center Frequency</span>
            <input type='text' name='cf' value={specAState.cf} onChange={e => handleChangeCF(e)}></input>
            <span>Span</span>
            <input type='text' value={specAState.bw} onChange={e => handleChangeBW(e)}></input>
            <button onClick={() => handleClickSet()}>SET</button>
        </div>
    );
};

export default SpecA;