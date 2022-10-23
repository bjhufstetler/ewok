import React, { useEffect, useState } from 'react';
import { TbPlus, TbEyeOff, TbEye } from 'react-icons/tb';
import { useEwokContext } from '../../context/EwokContext';

const SignalDetails = () => {
    const makeConn:Function = () => {
        var result : string = '';
        var characters : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 8; i++ ) result += characters.charAt(Math.floor(Math.random() * 62));
        return result;
    }

    const { ewok, setEwok } = useEwokContext();
    const [equipment, setEquipment] = useState<equipment[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [selection, setSelection] = useState<number>(-1);
    const [signal, setSignal] = useState<equipment>({
        id: 0,
        conn: '',
        server: '',
        team: '',
        unit_type: '',
        unit_name: '',
        cf: 0,
        bw: 0,
        power: 0,
        sat: '',
        feed: '',
        active: true
    });

    useEffect(() => {
        const tmpEquipment= ewok.equipment.filter(team => team.team == "Instructor" && team.server == ewok.server);
        setEquipment(tmpEquipment);
    }, [ewok])
    
    useEffect(() => {
        const tmpGroups = [...new Set([...equipment.map(x => x.unit_type)])]
        setGroups(tmpGroups)
    }, [equipment])
    
    useEffect(() => {
        const tmpSignal= [...equipment].filter(x => x.id == selection);
        setSignal(tmpSignal[0])
    }, [selection])
    
    const handleClickPlus: Function = () => {
        //TODO: Post to db
        let tmpEquipment = [...equipment];
        let maxID = Math.max(...tmpEquipment.map(x => x.id));
        if(!isFinite(maxID)) maxID = 1;
        tmpEquipment.push({
            id: maxID + 1,
            conn: makeConn(),
            server: ewok.server,
            team: ewok.team,
            unit_type: 'New Group',
            unit_name: 'New Signal',
            cf: 0,
            bw: 0,
            power: 0,
            sat: 'Satellite A',
            feed: 'Feed 01',
            active: false
        })
        let tmpEwok = {...ewok, equipment: tmpEquipment};
        setEwok(tmpEwok)
    }
    
    const handleClickSaveScenario: Function = () => {
        //TODO: Post to db
        navigator.clipboard.writeText(JSON.stringify(equipment))
        .then(() => alert("Scenario data saved to clipboard."))
    }
    
    const handleClickLoadScenario: Function = () => {
        let tmpEquipmentString : string | null = prompt("Paste saved sceanrio data here then click submit");
        let tmpEquipment : Array<equipment> = JSON.parse(tmpEquipmentString!);
        tmpEquipment.forEach(x => x.server = ewok.server)
        const tmpEwok = {...ewok, equipment: tmpEquipment};
        tmpEquipment ? setEwok(tmpEwok) : alert("Unable to load from provided data.")
    }

    const handleClickDelete: Function = () => {
        //TODO: Delete from db
        if(selection != -1){
            const tmpEquipment = [...equipment];
            const index = tmpEquipment.map(x => x.id).indexOf(Number(selection));
            tmpEquipment?.splice(index, 1)
            const newSelection = tmpEquipment[0]?.id;
            let tmpEwok = {...ewok, equipment: tmpEquipment};
            setEwok(tmpEwok)    
            setSelection(newSelection);
        }
    }
    
    const handleClickRevert: Function = () => {
        const tmpSignal = equipment.filter(x => x.id == selection);
        setSignal(tmpSignal[0])
    }
    
    const handleClickSave: Function = () => {
        //TODO: patch to db
        const tmpEquipment : Array<equipment> = [...equipment];
        const index = tmpEquipment.map(x => x.id).indexOf(Number(selection));
        const tmpActive : boolean = tmpEquipment[index].active;
        tmpEquipment[index] = {...signal, active: tmpActive};

        let tmpsatEnv = [...ewok.satEnv];
        const envIndex = tmpsatEnv.map(x => x.conn).indexOf(signal.conn);
        if(tmpActive) tmpsatEnv[envIndex] = {
            ...tmpsatEnv[envIndex],
            cf: signal.cf,
            bw: signal.bw,
            power: signal.power,
            sat: signal.sat
        };
        //tmpsatEnv.splice(envIndex, 1);
                
        let tmpEwok = {
            ...ewok,
            satEnv: tmpsatEnv,
            equipment: tmpEquipment
        };
        setEwok(tmpEwok);
    }
    
    const handleUnitTypeChange = ( value : string) => {
        let tmpSignal = {
            ...signal,
            unit_type: value
        };
        setSignal(tmpSignal);
    }
    
    const handleUnitNameChange = ( value : string) => {
        let tmpSignal = {
            ...signal,
            unit_name: value
        };
        setSignal(tmpSignal);
    }
    
    const handleCFChange = ( value : string) => {
        let tmpValue = null;
        if(!isNaN(Number(value))) tmpValue = value;
        let tmpSignal = {
            ...signal,
            cf: Number(tmpValue)
        };
        setSignal(tmpSignal);
    }
    
    const handleBWChange = ( value : string) => {
        let tmpValue = null;
        if(!isNaN(Number(value))) tmpValue = value;
        let tmpSignal = {
            ...signal,
            bw: Number(tmpValue)
        };
        setSignal(tmpSignal);
    }
    
    const handlePowerChange = ( value : string) => {
        let tmpValue = null;
        if(!isNaN(Number(value))) tmpValue = -1 * Math.abs(Number(value));
        let tmpSignal = {
            ...signal,
            power: Number(tmpValue)
        };
        setSignal(tmpSignal);
    }
    
    const handleSatChange = ( value : string) => {
        let tmpSignal = {
            ...signal,
            sat: value
        };
        setSignal(tmpSignal);
    }
    
    const handleFeedChange = ( value : string) => {
        let tmpSignal = {
            ...signal,
            feed: value
        };
        setSignal(tmpSignal);
    }

    const GroupComponent = ({ group } : { group : string }) => {
        const [visibleGroup, setVisibleGroup] = useState<boolean>(true);

        //const handleClickGroupEyeball = () => {};

        return(
            <div className='signalGroup' key={group}>
                <span>{group}</span> 
                <div></div>
                {/* TODO: implement group <enable />
                    <disable></disable>visibleGroup ?
                    <TbEye color='grey' id={group} onClick={()=> handleClickGroupEyeball()}/>
                    : <TbEyeOff color='red' id={group} onClick={()=> handleClickGroupEyeball()}/>*/}
                
                {equipment.filter(x => x.unit_type == group).map((groupSignal, groupSignalIndex) => (
                    <SignalComponent key={ groupSignalIndex } groupSignal={ groupSignal } visibleGroup={ visibleGroup }/>
                ))}
            </div>
        )
    }

    const SignalComponent = ({ groupSignal, visibleGroup } : { groupSignal : equipment, visibleGroup: boolean }) => {
        const [visibleSignal, setVisibleSignal] = useState<boolean>(groupSignal.active)

        const handleClickSignalEyeball = () => {
            if(visibleSignal && visibleGroup) {
                let tmpEquipment = [...equipment];
                const index = tmpEquipment.map(x => x.id).indexOf(groupSignal.id);
                tmpEquipment[index].active = false;
                
                let tmpsatEnv = [...ewok.satEnv];
                const envIndex = tmpsatEnv.map(x => x.conn).indexOf(groupSignal.conn);
                
                tmpsatEnv.splice(envIndex, 1);
                
                let tmpEwok = {...ewok, satEnv: tmpsatEnv, equipment: tmpEquipment};
                setEwok(tmpEwok);
            } else {
                let tmpEquipment = [...equipment];
                const index = tmpEquipment.map(x => x.id).indexOf(groupSignal.id);
                tmpEquipment[index].active = true;

                let tmpsatEnv = [...ewok.satEnv];
                const maxID = Math.max(...tmpsatEnv.map(x => x.id))
                tmpsatEnv.push({
                    id: maxID + 1,
                    server: ewok.server,
                    conn: groupSignal.conn,
                    team: 'Instructor',
                    cf: groupSignal.cf,
                    bw: groupSignal.bw,
                    power: groupSignal.power,
                    sat: groupSignal.sat,
                    feed: groupSignal.feed,
                    stage: "ULRF"})
                
                let tmpEwok = {...ewok, satEnv: tmpsatEnv, equipment: tmpEquipment};
                setEwok(tmpEwok);
            }
        }
        
        const handleClickedSignal = () => {
            setSelection(groupSignal.id)
        }

        return(
            <React.Fragment key={ groupSignal.id }>
                <div className='signal'>
                    <span id={ groupSignal.id.toString() } onClick={() => handleClickedSignal()}>{ groupSignal.unit_name }</span> 
                </div>
                {visibleSignal ?
                    <TbEye color={!visibleGroup || !visibleSignal ? 'red' : 'white'} id={groupSignal.id.toString()} onClick={()=> handleClickSignalEyeball()}/>
                    :<TbEyeOff color={!visibleGroup || !visibleSignal ? 'red' : 'white'} id={groupSignal.id.toString()} onClick={()=> handleClickSignalEyeball()}/>}
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
                {groups.map((group, groupID) => (
                    <GroupComponent key={groupID} group={ group } />
                ))}
                <button onClick={() => handleClickSaveScenario()}>Save Scenario</button>
                <button onClick={() => handleClickLoadScenario()}>Load Scenario</button>
            </div>
            <div className="signalDetails">
                <div>
                    <span>Group</span>
                    <input type='text' value={signal?.unit_type} onChange={e => handleUnitTypeChange(e.target.value)}></input>
                </div>
                <div>
                    <span>Signal</span>
                    <input type='text' value={signal?.unit_name} onChange={e => handleUnitNameChange(e.target.value)}></input>
                </div>
                <div>
                    <span>CF</span>
                    <input type='text' value={signal?.cf} onChange={e => handleCFChange(e.target.value)}></input>
                    <span>MHz</span>
                </div>
                <div>
                    <span>BW</span>
                    <input type='text' value={signal?.bw} onChange={e => handleBWChange(e.target.value)}></input>
                    <span>MHz</span>
                </div>
                <div>
                    <span>Power</span>
                    <input type='text' value={signal?.power} onChange={e => handlePowerChange(e.target.value)}></input>
                    <span>dB</span>
                </div>
                <div>
                    <span>Sat</span>
                    <select value={signal?.sat} onChange={e => handleSatChange(e.target.value)}>
                        <option value='Satellite A'>Satellite A</option>
                        <option value='Satellite B'>Satellite B</option>
                        <option value='Satellite C'>Satellite C</option>
                    </select>
                    <span>dB</span>
                </div>
                <div>
                    <span>Feed</span>
                    <select value={signal?.feed} onChange={e => handleFeedChange(e.target.value)}>
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
