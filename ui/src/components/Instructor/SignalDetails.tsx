import React, { useEffect, useState } from 'react';
import { TbPlus, TbEyeOff, TbEye } from 'react-icons/tb';
import { useEwokContext, useEquipmentContext, useSatEnvContext } from '../../context/EwokContext';

// TODO: connect equipment to db instead of state

const SignalDetails = () => {
    // Create a function to generate random codes to link equipment to signals
    const makeConn:Function = () => {
        var result : string = '';
        var characters : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 8; i++ ) result += characters.charAt(Math.floor(Math.random() * 62));
        return result;
    }

    // Declare ewok context {server, team}
    const { ewok, socket, satellites } = useEwokContext();
    const { equipment } = useEquipmentContext();
    const { satEnv } = useSatEnvContext();

    // Declare temporary input state
    const initSignal : equipment = {
            id: -1,
            conn: '',
            server: ewok.server,
            team: 'Instructor',
            unit_type: '',
            unit_name: '',
            cf: 0,
            bw: 0,
            dr: 0,
            fec: 0,
            mod: 0,
            power: 0,
            sat: '',
            feed: '',
            active: false
    } ;
    const [selection, setSelection] = useState<equipment>(initSignal);
    
    // Handle sidebar buttons
    const handleClickPlus: Function = () => {
        
        // Create tmpSignal from template
        const tmpSignal = {
            ...initSignal,
            id: Math.floor(Math.random() * 100000),
            conn: makeConn(),
            unit_type: 'New Group',
            unit_name: 'New Signal',
            cf: 1500,
            bw: 10,
            dr: 1,
            fec: 1,
            mod: 2,
            power: -90,
            sat: 'ASH',
            feed: 'Feed 01'
        };
        console.log(tmpSignal)
        socket.emit('POST', 'equipment', tmpSignal)
    };
    
    // Copy [equipment] to clipboard 
    const handleClickSaveScenario: Function = () => {
        navigator.clipboard.writeText(JSON.stringify(equipment))
            .then(() => alert("Scenario data saved to clipboard."));
    };
    
    // Load [equipment] from text input
    const handleClickLoadScenario: Function = () => {
        // Prompt for input then parse as json
        let tmpEquipmentString : string | null = prompt("Paste saved sceanrio data here then click submit");
        let tmpEquipment : Array<equipment> = JSON.parse(tmpEquipmentString!);
        if (tmpEquipment) {
            // Set the server id for each signal
            tmpEquipment.forEach(signal => {
                signal.server = ewok.server
                signal.active = false
            });
            // Update [equipment]
            satEnv.filter(signal => signal.team === 'Instructor').forEach(signal => {
                socket.emit('DELETE', 'satEnv', signal)
            });
            equipment.filter(signal => signal.team === 'Instructor').forEach(signal => {
                socket.emit('DELETE', 'equipment', signal)
            });
            tmpEquipment.forEach(signal => {
                socket.emit('POST', 'equipment', signal)
            });
        };
    };   

    // DELETE signal from db
    const handleClickDelete: Function = () => {
        if(selection.id !== -1) socket.emit('DELETE', 'equipment', selection)
    };
    
    // Restore selection from db
    const handleClickRevert: Function = () => {
        if( selection.id > -1 ) {
            const tmpSignal = equipment.filter((x: any) => x.id === selection.id)[0];
            setSelection(tmpSignal as any)
        };
    };
    
    // Patch entry in db
    const handleClickSave: Function = () => {
        if ( selection.id > -1 ) {
            // Get active from [equipment]
            const index = equipment.map((x: any) => x.id).indexOf(selection.id);
            const tmpActive : boolean = equipment[index].active;
            const band = satellites.filter(x => x.sat === selection.sat)[0]?.band;
            const tmpSelection = {...selection, active: tmpActive};
            // If active, PATCH [satEnv]
            if ( tmpActive ) {
                const tmpSignal = {
                    id: selection.id,
                    server: selection.server,
                    conn: selection.conn,
                    team: selection.team,
                    cf: Number(selection.cf),
                    dr: Number(selection.dr),
                    fec: Number(selection.fec),
                    mod: Number(selection.mod),
                    power: selection.power,
                    sat: selection.sat,
                    feed: selection.feed,
                    band: band,
                    stage: "ULRF"
                };
                socket.emit('PATCH', 'satEnv', tmpSignal);
            };
            socket.emit('PATCH', 'equipment', tmpSelection);
        };
    };
    
    const handleUnitTypeChange = ( value : string) => {
        let tmpSelection = {
            ...selection,
            unit_type: value
        };
        setSelection(tmpSelection);
    };
    
    const handleUnitNameChange = ( value : string) => {
        let tmpSelection = {
            ...selection,
            unit_name: value
        };
        setSelection(tmpSelection);
    };
    
    const handleCFChange = ( value : string) => {
        //let tmpValue = 0;
        //if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            cf: Number(value)
        };
        setSelection(tmpSelection);
    };
    
    const handleDRChange = ( value : string) => {
        //let tmpValue = 0;
        //if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            dr: Number(value)//tmpValue
        };
        setSelection(tmpSelection);
    }

    const handleModChange = ( value : string) => {
        let tmpValue = 0;
        if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            mod: tmpValue
        };
        setSelection(tmpSelection);
    }

    const handleFecChange = ( value : string) => {
        let tmpValue = 0;
        if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            fec: tmpValue
        };
        setSelection(tmpSelection);
    }
    
    const handlePowerChange = ( value : string) => {
        //let tmpValue = 0;
        //if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            power: -1 * Math.abs(Number(value))
        };
        setSelection(tmpSelection);
    }
    
    const handleSatChange = ( value : string) => {
        let tmpSelection = {
            ...selection,
            sat: value
        };
        setSelection(tmpSelection);
    }
    
    const handleFeedChange = ( value : string) => {
        let tmpSelection = {
            ...selection,
            feed: value
        };
        setSelection(tmpSelection);
    }

    const GroupComponent = ({ group, signals } : { group : string, signals: any }) => {
        // TODO: enable/disable with group eyeball
        const [v, setV] = useState<boolean>(true);
        const handleClickV = () => {
            setV(!v)
        }
        const [visibleGroup, setVisibleGroup] = useState<boolean>(true);
        const handleClickGroupEyeball = () => {
            signals.filter((x: any) => x.unit_type === group).forEach((signal: equipment) => {
                if ( visibleGroup ) { 
                    socket.emit('DELETE', 'satEnv', signal)
                    socket.emit('PATCH', 'equipment', {
                        ...signal,
                        active: false
                    })
                    setVisibleGroup(!visibleGroup)
                } else {
                    socket.emit('POST', 'satEnv', {
                        id: signal.id,
                        server: signal.server,
                        conn: signal.conn,
                        team: signal.team,
                        cf: Number(signal.cf),
                        dr: Number(signal.dr),
                        fec: Number(signal.fec),
                        mod: Number(signal.mod),
                        power: signal.power,
                        band: satellites.filter(sat => sat.sat === signal.sat)[0].band,
                        sat: signal.sat,
                        feed: signal.feed,
                        stage: "ULIF",
                        active: true
                    })
                    socket.emit('PATCH', 'equipment', {
                        ...signal,
                        active: true
                    })
                    setVisibleGroup(!visibleGroup)
                }
            })

        }
        return(
            <div className='signalGroup' key= { group }>
                <div>
                    <span>{group}</span> 
                    {v ? 
                        <span onClick={() => handleClickV()}>^</span>
                        : <span onClick={() => handleClickV()}>v</span>}
                    {/*<TbEye color={!visibleGroup ? 'red' : 'white'} onClick={()=> handleClickGroupEyeball()}/>
                    */}
                </div>
                <div></div>
                {v ? 
                    signals.filter((x: any) => x.unit_type === group).sort((a: any,b: any) => (a.unit_name > b.unit_name) ? 1 : ((b.unit_name > a.unit_name) ? -1 : 0)).map((groupSignal: any, groupSignalIndex: number) => {
                        //console.log(groupSignal)
                        return(
                        <SignalComponent key={ groupSignalIndex } groupSignal= { groupSignal }/>
                    )})
                    : <></>
                }
            </div>
        )
    }

    const SignalComponent = ({ groupSignal } : { groupSignal : equipment }) => {
        const [visibleSignal, setVisibleSignal] = useState<boolean>(groupSignal.active)
        const handleClickSignalEyeball = () => {
            if ( visibleSignal ) { 
                socket.emit('DELETE', 'satEnv', groupSignal);
                // Toggle eyeball
                setVisibleSignal(false)
                socket.emit('PATCH', 'equipment', {...groupSignal, active: false});
            } else {
                const band = satellites.filter(x => x.sat === groupSignal.sat)[0]?.band;
                const tmpGroupSignal = {
                    id: groupSignal.id,
                    server: groupSignal.server,
                    conn: groupSignal.conn,
                    team: groupSignal.team,
                    cf: Number(groupSignal.cf),
                    dr: Number(groupSignal.dr),
                    fec: Number(groupSignal.fec),
                    mod: Number(groupSignal.mod),
                    power: groupSignal.power,
                    band: band,
                    sat: groupSignal.sat,
                    feed: groupSignal.feed,
                    stage: "ULIF",
                    active: true
                };
                socket.emit('POST', 'satEnv', tmpGroupSignal);
                setVisibleSignal(true)
                console.log(groupSignal)
                socket.emit('PATCH', 'equipment', {...groupSignal, active: true});
            }
        };
        
        const handleClickedSignal = () => {
            setSelection(groupSignal)
        };

        return(
            <React.Fragment key={ groupSignal.id }>
                <div className='signal'>
                    <span id={ groupSignal.id.toString() } onClick={() => handleClickedSignal()}>{ groupSignal.unit_name }</span> 
                </div>
                {visibleSignal ?
                    <TbEye color={!visibleSignal ? 'red' : 'white'} id={groupSignal.id.toString()} onClick={()=> handleClickSignalEyeball()}/>
                    :<TbEyeOff color={!visibleSignal ? 'red' : 'white'} id={groupSignal.id.toString()} onClick={()=> handleClickSignalEyeball()}/>}
            </React.Fragment>
        )
    }
    
    return(
        <>
            <div className="sidebar">
                <div>
                    <span>Signals</span>
                    <TbPlus onClick={() => handleClickPlus()}/>
                </div>
                <hr></hr>
                {satellites.map(satellite => {
                    const signals = equipment.filter(signal => signal.sat === satellite.sat);
                    const groups = [...new Set(signals.map(signal => signal.unit_type).sort((a: any,b: any) => (a > b) ? 1 : ((b > a) ? -1 : 0)))];
                    return(
                        <>
                            <div>
                                <span className='satGroup'>{satellite.sat}</span>
                                <span></span>
                            </div>
                            {groups?.map((group: string, groupID: number) => {
                                return(<GroupComponent key={ groupID } signals={ signals } group={ group } />)
                            })}
                        </>
                    )
                })}
                <button onClick={() => handleClickSaveScenario()}>Save Scenario</button>
                <button onClick={() => handleClickLoadScenario()}>Load Scenario</button>
            </div>
            <div className="signalDetails">
                <div>
                    <span>Group</span>
                    <input type='text' value={selection?.unit_type} onChange={e => handleUnitTypeChange(e.target.value)}></input>
                </div>
                <div>
                    <span>Signal</span>
                    <input type='text' value={selection?.unit_name} onChange={e => handleUnitNameChange(e.target.value)}></input>
                </div>
                <div>
                    <span>CF</span>
                    <input type='text' value={selection?.cf} onChange={e => handleCFChange(e.target.value)}></input>
                    <span>MHz</span>
                </div>
                <div>
                    <span>DR</span>
                    <input type='text' value={selection?.dr} onChange={e => handleDRChange(e.target.value)}></input>
                    <span>MHz</span>
                </div>
                <div>
                    <span>Mod</span>
                    <select value={selection?.mod} onChange={e => handleModChange(e.target.value)}>
                        <option value={1}>BPSK</option>
                        <option value={2}>QPSK</option>
                    </select>
                    <span></span>
                </div>
                <div>
                    <span>FEC</span>
                    <select value={selection?.fec} onChange={e => handleFecChange(e.target.value)}>
                        <option value={1}>1/2</option>
                        <option value={3}>3/4</option>
                        <option value={7}>7/8</option>
                    </select>
                    <span></span>
                </div>
                <div>
                    <span>Power</span>
                    <input type='text' value={selection?.power} onChange={e => handlePowerChange(e.target.value)}></input>
                    <span>dB</span>
                </div>
                <div>
                    <span>Sat</span>
                    <select value={selection?.sat} onChange={e => handleSatChange(e.target.value)}>
                        <option value='ASH'>ASH</option>
                        <option value='DRSC'>DRSC</option>
                        <option value='ArCOM'>ArCOM</option>
                    </select>
                    <span>dB</span>
                </div>
                <div>
                    <span>Feed</span>
                    <select value={selection?.feed} onChange={e => handleFeedChange(e.target.value)}>
                        <option value='static.mp4'>Static</option>
                        <option value='red 1.mp4'>Red 1</option>
                        <option value='red 2.mp4'>Red 2</option>
                        <option value='red 3.mp4'>Red 3</option>
                        <option value='red 4.mp4'>Red 4</option>
                        <option value='red 5.mp4'>Red 5</option>
                        <option value='red 6.mp4'>Red 6</option>
                        <option value='red 7.mp4'>Red 7</option>
                        <option value='red 8.mp4'>Red 8</option>
                        <option value='red 9.mp4'>Red 9</option>
                        <option value='blue 1.mp4'>Blue 1</option>
                        <option value='blue 2.mp4'>Blue 2</option>
                        <option value='testVid.mp4'>Test 1</option>
                    </select>
                    <span>dB</span>
                </div>
                <div>
                    <button onClick = {() => handleClickDelete()}>Delete</button>
                    <button onClick = {() => handleClickRevert()}>Revert</button>
                    <button onClick = {() => handleClickSave()}>Save</button>
                </div>
            </div>
        </>
    )
}

export default SignalDetails;

interface equipment {
    id: number,
    conn: string,
    server: string,
    team: string,
    unit_type: string,
    unit_name: string,
    cf: number,
    bw: number,
    dr: number,
    fec: number,
    mod: number,
    power: number,
    sat: string,
    feed: string,
    active: boolean
};
