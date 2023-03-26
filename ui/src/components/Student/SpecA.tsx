import { useEwokContext, useEquipmentContext, useSatEnvContext } from "../../context/EwokContext";
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './StudentPage.css';
import './SpecA.css';

const SpecA = ({ unit_name } : { unit_name: string}) => {

    const { ewok, satellites } = useEwokContext();
    const { equipment } = useEquipmentContext();
    const { satEnv } = useSatEnvContext();

    // Update the plot at a regular interval (0.1 second)
    const refreshRate = 5 // hz
    const [plotTimer, setPlotTimer] = useState<boolean>(false);
    useEffect(() => {
        setTimeout(() => {
            setPlotTimer(!plotTimer);
        }, 1000 / refreshRate);
    }, [plotTimer]);
    
    // Hold settings in state noting that only one piece of equipment is being used
    const tmpSettings = {cf: 1500, bw: 1000, lb: -101, ub: -70, ll: -101, ul: -70};
    
    const [ settings, setSettings ] = useState(tmpSettings);
    const [ specA, setSpecA ] = useState(tmpSettings);
    
    const handleChangeCF = (e: any) => {
        let tmpSettings = {
            ...settings,
            cf: e.target.value
        };
        setSettings(tmpSettings);
    };
    
    const handleChangeBW = (e: any) => {
        let tmpSettings = {
            ...settings,
            bw: e.target.value
        };
        setSettings(tmpSettings);
    };

    const handleChangeUB = (e: any) => {
        let tmpSettings = {
            ...settings,
            ub: e.target.value
        };
        setSettings(tmpSettings);
    };

    const handleChangeLB = (e: any) => {
        let tmpSettings = {
            ...settings,
            lb: e.target.value
        };
        setSettings(tmpSettings);
    };
    
    const handleClickScale = () => {
        // Get extents for auto scale      
        const lb = Math.min.apply(Math, y) - 1;
        const ub = Math.max.apply(Math, y) + 1;
        const tmpEquipment = {
            ...specA,
            lb: lb,
            ub: ub
        };
        setSpecA(tmpEquipment);
    }; 

    const handleClickSet = () => {
        if(!isNaN(settings.cf) 
        && !isNaN(settings.bw) 
        && !isNaN(settings.ub) 
        && !isNaN(settings.lb)
        && Number(settings.lb) < Number(settings.ub)) {
            const cf = Number(settings.cf);
            const bw = Number(settings.bw);
            if (cf !== specA.cf || bw !== specA.bw ) setY(initY);
            const ub = Number(settings.ub);
            const lb = Number(settings.lb);
            const tmpBw = cf - bw/2 <= 0 ? cf * 2 : bw;
            const tmpEquipment = {
                ...specA,
                cf: cf,
                bw: tmpBw,
                ub: ub,
                lb: lb
            }
            setSpecA(tmpEquipment);
        }
    };
    
    const [markerX, setMarkerX] = useState<number>(250);
    const initY = Array(500).fill(-103);
    const initYMax = Array(500).fill(-110);
    const [y, setY] = useState<any>(initY)
    const [maxY, setMaxY] = useState<any>(initYMax);
    const [max, setMax] = useState<boolean>(false);
    const handleClickMax = () => {
        setMaxY(initYMax);
        setMax(!max);
    };

    const [lockY, setLockY] = useState<any>(initYMax);
    const [lock, setLock] = useState<boolean>(false);
    const handleClickLock = () => {
        setLockY([...y]);
        setLock(!lock);
    };
    useEffect(() => {
        setLock(false);
        setMaxY([...y]);
    }, [y])
        
    const handleClickLeft = () => {
        const tmpCf = Math.round(1000 * (specA.cf - specA.bw / 10)) / 1000;
        const tmpBw = tmpCf - specA.bw/2 < 0 ? tmpCf * 2 : specA.bw;
        const tmpEquipment = {
            ...specA,
            cf: tmpCf,
            bw: tmpBw
        }
        setSpecA(tmpEquipment);
        setY(initY);
    };
    const handleClickRight = () => {
        const tmpEquipment = {
            ...specA,
            cf: Math.round(1000 * (specA.cf + specA.bw / 10)) / 1000
        }
        setSpecA(tmpEquipment);
        setY(initY);
    };

    const handleClickZoomIn = () => {
        const tmpEquipment = {
            ...specA,
            bw: Math.round(specA.bw * .5 * 1000) / 1000
        }
        setSpecA(tmpEquipment);
        setY(initY);
    };
    const handleClickZoomOut = () => {
        const tmpBw = Math.round(specA.bw * 1.5 * 1000) / 1000
        const tmpCf = specA.cf - tmpBw/2 < 0 ? tmpBw / 2 : specA.cf;
        const tmpEquipment = {
            ...specA,
            cf: tmpCf,
            bw: tmpBw
        }
        setSpecA(tmpEquipment);
        setY(initY);
    };

    const randn_bm = () => {
        let u = 1 - Math.random(); // [-1, 0]
        let v = Math.random(); // [0, 1]
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    const SpecAPlot = () => {
        //const plotTimerObserver = plotTimer;
        const plotXRange = [specA?.cf - specA?.bw / 2, specA?.cf + specA?.bw / 2];
        const plotX : Array<number> = Array(500).fill(0).map((_, idx) => idx * (plotXRange[1] - plotXRange[0]) / 500 + plotXRange[0]);
        const plotYLimit : Array<number> = Array(500).fill(-60);
        let plotY : Array<number> = y;
        let tmpMaxY : Array<number> = maxY;
        const antenna = equipment?.filter(x => x.unit_type === 'Antenna')[0];
        let plotEnv: any = null;
        // Uplink IF
        if ( unit_name === '1') {
            plotEnv = [...satEnv?.filter(x => x.team === ewok.team)];

        // Uplink RF
        } else if ( unit_name === '2') {
            plotEnv = [...satEnv?.filter(x => x.team === ewok.team).map(x => {
                const uc = satellites?.filter(satellite => satellite?.band === x?.band)[0]?.uc;
                return(
                    {
                        ...x,
                        cf: x.cf + uc,
                        power: x.power - 1 // 1 dB power drop from ULIF to ULRF
                    } 
                )
            })]

        // Downlink IF
        } else if( unit_name === '3') {
            plotEnv = [...satEnv?.filter(x => (x.team === ewok.team && x.lb) || x.active).map(x => {
                const uc = satellites?.filter(satellite => satellite.band === x.band)[0]?.uc; // Upconvert from signal
                const dc = satellites?.filter(satellite => satellite.band === antenna?.unit_name)[0]?.dc; // Downconvert from antenna
                const ttf = x.team === ewok?.team && antenna?.power ? antenna?.cf : satellites?.filter(satellite => satellite.sat === x.sat)[0]?.ttf; // TTF from satellite
                const fspl = satellites?.filter(satellite => satellite.band === antenna?.unit_name)[0]?.fspl; // FSPL from satellite
                return(
                    {...x,
                    cf: x.cf + uc + ttf + dc,
                    power: x.power - 1 - fspl - 1,}
                )
            })]

        // Downlink RF
        } else if( unit_name === '4') {
            plotEnv = [...satEnv?.filter(x => (x.team === ewok.team && x.lb) || x.active).map(x => { //plotEnv = [...satEnv?.filter(signal => signal.active || signal.lb).map(x => {
                const uc = satellites?.filter(satellite => satellite.band === x.band)[0]?.uc; // Upconvert from signal
                const ttf =  x.team === ewok?.team && antenna?.power ? antenna?.cf : satellites?.filter(satellite => satellite.sat === x.sat)[0]?.ttf; // TTF from satellite
                const fspl = satellites?.filter(satellite => satellite.band === antenna?.unit_name)[0]?.fspl; // FSPL from satellite
                return(
                    {...x,
                    cf: x.cf + ttf + uc,
                    power: x.power - 1 - fspl}
                )
            })]
        };

        plotX.map((x, xid) => {
            let signalPower = plotEnv.filter((env: any) => (
                env.sat === antenna?.sat &&
                env.cf - env.dr * (1 + 1/(env.fec)) / ( env.mod * 2 ) <= x &&
                env.cf + env.dr * (1 + 1/(env.fec)) / ( env.mod * 2 ) >= x)).map((signal: any) => signal.power * (1 + (1 / (20 * signal.mod)) + ( 1 / (20 * signal.fec))))
            signalPower.push(-100)
            let tmpY = Math.max(...signalPower);
            const variability = y[xid] > -100 ? .3 : .6
            //tmpY = tmpY - .9 * (tmpY - y[xid]) - Math.abs(variability * randn_bm()) + .2;
            tmpY = tmpY + variability * ( randn_bm() - .5);//Math.abs(variability * randn_bm()) + .2;
            plotY[xid] = tmpY;
            tmpMaxY[xid] = Math.max(tmpY, tmpMaxY[xid]);  
            return(null);
        })

        const plotData = [
            {
                x: plotX,
                y: plotY,
                line: {color: '#f6f955', width: .5},
                hoverinfo: "none",
            },
            {
                x: plotX,
                y: tmpMaxY,
                line: {color: '#5ef568', width: max ? .5 : 0},
                hoverinfo: "none",
            }
            ,
            {
                x: plotX,
                y: lockY,
                line: {color: '#5eb1f5', width: lock ? .5 : 0},
                hoverinfo: "none",
            }
        ];
        if( unit_name === '1' ) {
            plotData.push(
                {
                    x: plotX,
                    y: plotYLimit,
                    line: {color:'#c43932', width: 1.5},
                    hoverinfo: 'none',
                }
            )
        }
        return(
            <>
                <div>Spectrum Analyzer {unit_name}: {Number(unit_name) < 3 ? 'Uplink ' : 'Downlink '}{Number(unit_name) % 2 === 0 ? 'RF' : 'IF'}</div>
                <div className='specAPlot'>
                    <Plot
                        data = {plotData}
                        layout = { 
                            {
                                width: 800, height: 240, plot_bgcolor: "#2e292b", paper_bgcolor: "#2e292b",
                                margin: { l: 55, r: 10, b: 40, t: 10, pad: 1 },
                                xaxis: { 
                                    title: 'MHz',
                                    color: 'white',
                                    range: [specA?.cf - specA?.bw / 2, specA?.cf + specA?.bw / 2],
                                    fixedrange: true
                                    
                                },
                                yaxis: { title: 'dB', color: 'white', fixedrange : true, range: [specA?.lb, specA?.ub]},
                                font: { color: 'white'}, legend: { y: 0 },
                                modebar: {remove: ["autoScale2d", 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'pan2d', 'resetScale2d', 'toImage']},
                                dragmode: 'select',
                                showlegend: false,
                                annotations: [
                                    {
                                        x: plotX[markerX],
                                        y: plotY[markerX],
                                        xref: 'x',
                                        yref: 'y',
                                        text: String(Math.round(100*plotX[markerX])/100) + ' MHz',
                                        showarrow: true,
                                        arrowhead: 7,
                                        ax: 0,
                                        ay: -35
                                    },
                                    {
                                        x: plotX[markerX],
                                        y: plotY[markerX],
                                        xref: 'x',
                                        yref: 'y',
                                        text: String(Math.round(100*plotY[markerX])/100) + ' dB',
                                        showarrow: true,
                                        arrowhead: 1,
                                        arrowcolor: 'white',
                                        ax: 0,
                                        ay: -20
                                    }
                                ]
                            }   
                        }
                        
                    />
                </div>
            </>
        );
    };

    return(
        <div className='SpecA'>
            <SpecAPlot/>
            <div className='SpecAControls'>
                <div className='freqValues'>
                    <span>{Math.round(1000 * (specA?.cf - specA?.bw / 2)) / 1000} MHz</span>
                    <span className='cf'>{Math.round(1000 * specA?.cf) / 1000} MHz</span>
                    <span>{Math.round(1000 * (specA?.cf + specA?.bw / 2)) / 1000} MHz</span>
                </div>
                <div className='inputControl'>
                    <span className='label'>CF (MHz)</span>
                    {isNaN(settings.cf) ?
                        <input className="invalid" type='text' name='cf' value={settings?.cf} onChange={e => handleChangeCF(e)}></input>
                        : <input type='text' name='cf' value={settings?.cf} onChange={e => handleChangeCF(e)}></input>
                    }
                    {isNaN(settings.ub) || Number(settings.lb) > Number(settings.ub) ?
                        <input className='invalid' type='text' value={settings?.ub} onChange={e => handleChangeUB(e)}></input>
                        : <input type='text' value={settings?.ub} onChange={e => handleChangeUB(e)}></input>
                    }
                    <span className='unit'>Max dB</span>
                    <span className='label'>Span (MHz)</span>
                    {isNaN(settings.bw) ?
                        <input className="invalid" type='text' name='cf' value={settings?.bw} onChange={e => handleChangeBW(e)}></input>
                        : <input type='text' name='cf' value={settings?.bw} onChange={e => handleChangeBW(e)}></input>
                    }
                    {isNaN(settings.lb) || Number(settings.lb) > Number(settings.ub) ?
                        <input className='invalid' type='text' value={settings?.lb} onChange={e => handleChangeLB(e)}></input>
                        : <input type='text' value={settings?.lb} onChange={e => handleChangeLB(e)}></input>
                    }
                    <span className='unit'>Min dB</span>
                    <span></span>
                    <button onClick={() => handleClickSet()}>Set</button>
                    <button onClick={() => handleClickScale()}>Auto</button>
                    <span></span>
                    <span></span>
                </div>
                <div className='traceControl'>
                    <span>X Axis</span>
                    <button onClick={() => handleClickLeft()}>L</button>
                    <button onClick={() => handleClickRight()}>R</button>
                    <button onClick={() => handleClickZoomOut()}>-</button>
                    <button onClick={() => handleClickZoomIn()}>+</button>
                </div>
                <div className='traceControl'>
                    <span>Marker</span>
                    <button onClick={() => setMarkerX(markerX - 10)}>L</button>
                    <button onClick={() => setMarkerX(markerX + 10)}>R</button>
                </div>
                <div className='traceControl'>
                    <span>Trace</span>
                    <button onClick={() => handleClickMax()}>Max</button>
                    <button onClick={() => handleClickLock()}>Lock</button>
                </div>

            </div>
        </div>
    );
};

export default SpecA;