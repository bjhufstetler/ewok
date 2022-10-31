import { useEwokContext, useEquipmentContext, useSatEnvContext } from "../../context/EwokContext";
import { useEffect, useState } from 'react';
import './StudentPage.css';
import './SpecA.css';
import Plot from 'react-plotly.js';
import { RuxButton, RuxSwitch } from "@astrouxds/react";

const SpecA = ({ unit_name } : { unit_name: string}) => {

    // Import [ewok] for server/team information
    const { ewok } = useEwokContext();
    // Import [equipment] for SpecA settings
    const { equipment, setEquipment } = useEquipmentContext();
    // Import [satenv] for signal information 
    const { satEnv, setSatEnv } = useSatEnvContext();

    const [markerX, setMarkerX] = useState<number>(500);

    const [plotTimer, setPlotTimer] = useState<boolean>(false);
    useEffect(() => {
        setTimeout(() => {
            //setSatEnv([...satEnv]);
            setPlotTimer(!plotTimer);
        }, 100);
    }, [plotTimer]);

    const [dataTimer, setDataTimer] = useState<boolean>(false);
    useEffect(() => {
        setTimeout(() => {
            fetch(`${ewok.baseURL}/equipment?server=${ewok.server}&team=${ewok.team}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Cannot convert response to json');
                    };
                })
                .then(data => {
                    setEquipment(data)
                });
            fetch(`${ewok.baseURL}/satEnv?server=${ewok.server}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Cannot convert response to json');
                    };
                })
                .then(data => {
                    setSatEnv(data)
                });
            setDataTimer(!dataTimer);
        }, 1000);
    }, [dataTimer])

    // Hold settings in state noting that only one piece of equipment is being used
    const tmpSettings : equipment = {
        id: -1,
        conn: '',
        server: '',
        team: '',
        unit_type: '',
        unit_name: '',
        cf: 17500,
        bw: 30000,
        power: 0,
        sat: '',
        feed: '',
        active: true
    }
    const [ settings, setSettings ] = useState<equipment>(tmpSettings);
    // Declare settingState for holding interim settings
    const [settingState, setSettingState] = useState<equipment>(tmpSettings);

    // Update settings whenever equipment or ewok changes
    useEffect(() => {
        const tmpSettings = [...equipment]?.filter(x => 
            x.unit_type == "SpecA" && 
            x.unit_name == unit_name
            )[0];
        
        setSettings(tmpSettings)
        //setSettingState(tmpSettings)
    }, [ewok, equipment]);


    const handleChangeCF = (e: any) => {
        let tmpValue = 0;
        if(e.target.value > 0) tmpValue = e.target.value;
        let tmpSettingState = {
            ...settingState,
            cf: Number(tmpValue)
        };
        setSettingState(tmpSettingState);
    };

    const handleChangeBW = (e: any) => {
        let tmpValue = 0;
        if(e.target.value > 0) tmpValue = e.target.value;
        let tmpSettingState = {
            ...settingState,
            bw: Number(tmpValue)
        };
        setSettingState(tmpSettingState);
    };

    const handleClickSet = () => {
        const equipmentIndex = equipment.map(x => x.id).indexOf(settings.id);
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            cf: settingState.cf,
            bw: settingState.bw
        }
        fetch(`${ewok.baseURL}/table?table=equipment`, {
            method: 'PATCH', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmpEquipment)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Cannot convert response to json');
            };
        })
        .then(data => {
            setEquipment(data)
            setY(initY)
        });
    };
    const initY = Array(1000).fill(-103);
    const initYMax = Array(1000).fill(-110);
    const [y, setY] = useState<any>(initY)
    const [maxY, setMaxY] = useState<any>(initYMax);
    const [max, setMax] = useState<boolean>(false);
    const handleClickMax = () => {
        setMaxY(initYMax);
        setMax(!max);
    };
    const handleClickResetMax = () => {
        setMaxY(initYMax);
        setMax(true);
    };

    const [lockY, setLockY] = useState<any>(initYMax);
    const [lock, setLock] = useState<boolean>(false);
    const handleClickLock = () => {
        setLockY([...y]);
        setLock(!lock);
    };
    const handleClickResetLock = () => {
        setLockY([...y]);
        setLock(true);
    }
    useEffect(() => {
        setLock(false);
        setMaxY([...y]);
    }, [y])
        
    const handleClickLeft = () => {
        const equipmentIndex = equipment.map(x => x.id).indexOf(settings.id);
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            cf: Math.round(1000 * (settings.cf - settings.bw / 10)) / 1000
        }
        fetch(`${ewok.baseURL}/table?table=equipment`, {
            method: 'PATCH', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmpEquipment)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Cannot convert response to json');
            };
        })
        .then((data: Array<equipment>) => {
            setEquipment(data);
            setY(initY);

        });
    };
    const handleClickRight = () => {
        const equipmentIndex = equipment.map(x => x.id).indexOf(settings.id);
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            cf: Math.round(1000 * (settings.cf + settings.bw / 10)) / 1000
        }
        fetch(`${ewok.baseURL}/table?table=equipment`, {
            method: 'PATCH', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmpEquipment)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Cannot convert response to json');
            };
        })
        .then(data => {
            setEquipment(data);
            setY(initY);
        });
    };
    const handleClickZoomIn = () => {
        const equipmentIndex = equipment.map(x => x.id).indexOf(settings.id);
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            bw: Math.round(settings.bw * .5 * 1000) / 1000
        }
        fetch(`${ewok.baseURL}/table?table=equipment`, {
            method: 'PATCH', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmpEquipment)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Cannot convert response to json');
            };
        })
        .then(data => {
            setEquipment(data);
            setY(initY);
        });
    };
    const handleClickZoomOut = () => {
        const equipmentIndex = equipment.map(x => x.id).indexOf(settings.id);
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            bw: Math.round(settings.bw * 1.5 * 1000) / 1000
        }
        fetch(`${ewok.baseURL}/table?table=equipment`, {
            method: 'PATCH', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmpEquipment)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Cannot convert response to json');
            };
        })
        .then(data => {
            setEquipment(data);
            setY(initY);
        });
    };

    const randn_bm = () => {
        let u = 1 - Math.random(); //Converting [0,1) to (0,1)
        let v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    const SpecAPlot = () => {
        const plotTimerObserver = plotTimer;
        const plotXRange = [settings?.cf - settings?.bw / 2, settings?.cf + settings?.bw / 2]
        const plotX : Array<number> = Array(1000).fill(0).map((_, idx) => idx * (plotXRange[1] - plotXRange[0]) / 1000 + plotXRange[0])
        let plotY : Array<number> = y;
        let tmpMaxY : Array<number> = maxY;
        let plotEnv = [...satEnv.filter(x => x.team == ewok.team)];
        const antenna = equipment.filter(x => x.unit_type == 'Antenna')[0]
        const satTTF = antenna?.sat == 'Satellite A' ? 25 : antenna?.sat == 'Satellite B' ? 10 : 15;
        const antTTF = antenna?.cf;
        let ttf = satTTF;
        const converter = antenna?.unit_name == 'C' ? 5100 : antenna?.unit_name == 'Ku' ? 11050 : 30025;
        if ( unit_name == '2') {
            plotEnv = [...satEnv.filter(x => x.team == ewok.team).map(x => {
                return(
                    {...x,
                    cf: x.cf + converter}
                )
            })]
        } else if( unit_name == '3') {
            plotEnv = [...satEnv.map(x => {
                ttf = !antenna?.active && x.team == ewok.team ?
                    antTTF : satTTF
                return(
                    {...x,
                    cf: x.cf + ttf}
                )
            })]
        } else if( unit_name == '4') {
            plotEnv = [...satEnv.map(x => {
                ttf = !antenna?.active && x.team == ewok.team ?
                    antTTF : satTTF
                return(
                    {...x,
                    cf: x.cf + ttf + converter}
                )
            })]
        }
        plotX.map((x, xid) => {
            let signalPower = plotEnv.filter(env => 
                env.sat == antenna?.sat &&
                env.cf - env.bw / 2 <= x &&
                env.cf + env.bw / 2 >= x).map(signal => signal.power)
            signalPower.push(-100)
            let tmpY = Math.max(...signalPower);
            const variability = y[xid] > -100 ? .3 : .5
            tmpY = tmpY - .9 * (tmpY - y[xid]) - Math.abs(variability * randn_bm()) + .2;
            plotY[xid] = tmpY;
            tmpMaxY[xid] = Math.max(tmpY, tmpMaxY[xid]);
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
        /*
            TODO: saved states
        */
        return(
            <>
                <div>Spectrum Analyzer {unit_name}: {Number(unit_name) < 3 ? 'Uplink ' : 'Downlink '}{Number(unit_name) % 2 == 0 ? 'RF' : 'IF'}</div>
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
                                    range: [settings?.cf - settings?.bw / 2, settings?.cf + settings?.bw / 2],
                                    fixedrange: true
                                },
                                yaxis: { title: 'dB', color: 'white', fixedrange : true, range: [-103, -83]},
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
    }
    return(
        <div className='SpecA'>
            <SpecAPlot/>
            <div className='SpecAControls'>
                <div className='freqValues'>
                    <span>{Math.round(1000 * (settings?.cf - settings?.bw / 2)) / 1000} MHz</span>
                    <button onClick={() => handleClickLeft()}>L</button>
                    <button onClick={() => handleClickRight()}>R</button>
                    <button onClick={() => handleClickZoomOut()}>-</button>
                    <button onClick={() => handleClickZoomIn()}>+</button>
                    <span>{Math.round(1000 * settings?.cf) / 1000} MHz</span>
                    <span></span>
                    <button onClick={() => setMarkerX(markerX - 10)}>L</button>
                    <button onClick={() => setMarkerX(markerX + 10)}>R</button>
                    <span></span>
                    <span>{Math.round(1000 * (settings?.cf + settings?.bw / 2)) / 1000} MHz</span>
                </div>
                <div className='inputControl'>
                    <span className='label'>Center Frequency</span>
                    <input type='text' name='cf' value={settingState?.cf} onChange={e => handleChangeCF(e)}></input>
                    <span className='unit'>MHz</span>
                    <span className='label'>Span</span>
                    <input type='text' value={settingState?.bw} onChange={e => handleChangeBW(e)}></input>
                    <span className='unit'>MHz</span>
                    <span></span>
                    <button onClick={() => handleClickSet()}>SET</button>
                    <span></span>
                </div>
                <div className='traceControl'>
                    <button onClick={() => handleClickMax()}>Max Hold</button>
                    <button onClick={() => handleClickResetMax()}>Reset</button>
                </div>
                <div className='traceControl'>
                    <button onClick={() => handleClickLock()}>Lock</button>
                    <button onClick={() => handleClickResetLock()}>Reset</button>
                </div>

            </div>
        </div>
    );
};

export default SpecA;

interface equipment {
    id: number,
    conn: string,
    server: string,
    team: string,
    unit_type: string,
    unit_name: string,
    cf: number,
    bw: number,
    power: number,
    sat: string,
    feed: string,
    active: boolean
};