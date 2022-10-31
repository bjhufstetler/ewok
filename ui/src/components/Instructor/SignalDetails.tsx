import React, { useEffect, useState } from 'react';
import { TbPlus, TbEyeOff, TbEye } from 'react-icons/tb';
import { useFetch } from '../../hooks/useFetch';
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
    const { ewok } = useEwokContext();
    const { equipment, setEquipment } = useEquipmentContext();
    const { setSatEnv } = useSatEnvContext();

    // Fetch equipment and satEnv data
    
    const [groups, setGroups] = useState<any>()
    // Handle updates to equipment and satEnv
    useEffect(() => {
        const tmpGroups = new Set(equipment.map( (signal : any) => signal.unit_type ));
        setGroups([...tmpGroups]);
    }, [equipment])

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
            power: 0,
            sat: '',
            feed: '',
            active: false
    } ;
    const [selection, setSelection] = useState<equipment>(initSignal);
    
    // Handle sidebar buttons
    const handleClickPlus: Function = () => {
        // Clone equipment
        let tmpEquipment = [...equipment];
        // Create tmpSignal from template
        const tmpSignal = {
            ...initSignal,
            id: Math.floor(Math.random() * 100000),
            conn: makeConn(),
            unit_type: 'New Group',
            unit_name: 'New Signal',
            cf: 6500,
            bw: 10,
            power: -90,
            sat: 'Satellite A',
            feed: 'Feed 01'
        };
        // POST tmpSignal and update [equipment] from db
        fetch(`${ewok.baseURL}/table?table=equipment`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmpSignal)
        })
        .then(response => {
            if (response.ok) {
            } else {
                throw new Error('Cannot convert response to json');
            };
        })
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
        // Set the server id for each signal
        tmpEquipment.forEach(x => x.server = ewok.server);
        // Update [equipment]
        tmpEquipment ? setEquipment(tmpEquipment) : alert("Unable to load from provided data.");
    };

    // DELETE signal from db
    const handleClickDelete: Function = () => {
        if(selection.id != -1){
            fetch(`${ewok.baseURL}/table?table=equipment`, {
                method: 'DELETE', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selection)
            })
            .then(response => {
                if (response.ok) {
                } else {
                    throw new Error('Cannot convert response to json');
                };
            })
        };
    };
    
    // Restore selection from db
    const handleClickRevert: Function = () => {
        if( selection.id > -1 ) {
            const tmpSignal = equipment.filter((x: any) => x.id == selection.id)[0];
            setSelection(tmpSignal as any)
        };
    };
    
    // Patch entry in db
    const handleClickSave: Function = () => {
        console.log("id", selection.id)
        if ( selection.id > -1 ) {
            // Get active from [equipment]
            const index = equipment.map((x: any) => x.id).indexOf(selection.id);
            console.log('index', index)
            const tmpActive : boolean = equipment[index].active;
            const tmpSelection = {...selection, active: tmpActive};
            // If active, PATCH [satEnv]
            if ( tmpActive ) {
                const tmpSignal = {
                    id: selection.id,
                    server: selection.server,
                    conn: selection.conn,
                    team: selection.team,
                    cf: selection.cf,
                    bw: selection.bw,
                    power: selection.power,
                    sat: selection.sat,
                    feed: selection.feed,
                    stage: "ULRF"
                };
                fetch(`${ewok.baseURL}/table?table=satEnv`, {
                    method: 'PATCH', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tmpSignal)
                })
                .then(response => {
                    if (response.ok) {
                    } else {
                        throw new Error('Cannot convert response to json');
                    };
                })
                
            };
            // PATCH [equipment]
            fetch(`${ewok.baseURL}/table?table=equipment`, {
                method: 'PATCH', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tmpSelection)
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
            });
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
        let tmpValue = 0;
        if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            cf: tmpValue
        };
        setSelection(tmpSelection);
    };
    
    const handleBWChange = ( value : string) => {
        let tmpValue = 0;
        if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            bw: tmpValue
        };
        setSelection(tmpSelection);
    }
    
    const handlePowerChange = ( value : string) => {
        let tmpValue = 0;
        if(!isNaN(Number(value))) tmpValue = Number(value);
        let tmpSelection = {
            ...selection,
            power: -1 * Math.abs(tmpValue)
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

    const GroupComponent = ({ group } : { group : string }) => {
        // TODO: enable/disable with group eyeball
        return(
            <div className='signalGroup' key= { group }>
                <span>{group}</span> 
                <div></div>
                {equipment.filter((x: any) => x.unit_type == group).map((groupSignal: any, groupSignalIndex: number) => (
                    <SignalComponent key={ groupSignalIndex } groupSignal= { groupSignal }/>
                ))}
            </div>
        )
    }

    const SignalComponent = ({ groupSignal } : { groupSignal : equipment }) => {
        const [visibleSignal, setVisibleSignal] = useState<boolean>(groupSignal.active)
        const handleClickSignalEyeball = () => {
            if ( visibleSignal ) { 
                // DELETE from satEnv
                fetch(`${ewok.baseURL}/table?table=satEnv`, {
                    method: 'DELETE', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(groupSignal)
                })
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
                // Toggle eyeball
                setVisibleSignal(false)
                // PATCH equipment
                fetch(`${ewok.baseURL}/table?table=equipment`, {
                    method: 'PATCH', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...groupSignal, active: false})
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
                });
            } else {
                // POST to satEnv
                const tmpGroupSignal = {
                    id: groupSignal.id,
                    server: groupSignal.server,
                    conn: groupSignal.conn,
                    team: groupSignal.team,
                    cf: groupSignal.cf,
                    bw: groupSignal.bw,
                    power: groupSignal.power,
                    sat: groupSignal.sat,
                    feed: groupSignal.feed,
                    stage: "ULRF"
                };
                
                fetch(`${ewok.baseURL}/table?table=satEnv`, {
                    method: 'POST', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tmpGroupSignal)
                })
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
                // Toggle eyeball
                setVisibleSignal(true)
                // PATCH equipment
                fetch(`${ewok.baseURL}/table?table=equipment`, {
                    method: 'PATCH', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...groupSignal, active: true})
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
                });
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
                {groups?.map((group: string, groupID: number) => {
                    return(<GroupComponent key={groupID} group={ group } />)
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
                    <span>BW</span>
                    <input type='text' value={selection?.bw} onChange={e => handleBWChange(e.target.value)}></input>
                    <span>MHz</span>
                </div>
                <div>
                    <span>Power</span>
                    <input type='text' value={selection?.power} onChange={e => handlePowerChange(e.target.value)}></input>
                    <span>dB</span>
                </div>
                <div>
                    <span>Sat</span>
                    <select value={selection?.sat} onChange={e => handleSatChange(e.target.value)}>
                        <option value='Satellite A'>Satellite A</option>
                        <option value='Satellite B'>Satellite B</option>
                        <option value='Satellite C'>Satellite C</option>
                    </select>
                    <span>dB</span>
                </div>
                <div>
                    <span>Feed</span>
                    <select value={selection?.feed} onChange={e => handleFeedChange(e.target.value)}>
                        <option value='none'>No Feed</option>
                        <option value='Feed 01'>Video 01</option>
                        <option value='Feed 02'>Video 02</option>
                        <option value='Feed 03'>Video 03</option>
                        <option value='Feed 04'>Video 04</option>
                        <option value='Feed 05'>Video 05</option>
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
    power: number,
    sat: string,
    feed: string,
    active: boolean
};
