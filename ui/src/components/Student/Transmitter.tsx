import { useEffect, useState } from 'react';
import { useEwokContext, useEquipmentContext } from "../../context/EwokContext";
import './Transmitter.css'

const Transmitter = () => {
    const { equipment } = useEquipmentContext();
    const { socket } = useEwokContext();
    
    let tmpAntenna = [...equipment.filter(x => x.unit_type == 'Antenna')][0];
    let tmpTX = equipment.filter(x => x.unit_type == 'TX' && x.unit_name == tmpAntenna?.feed)[0];
    const [tx, setTX] = useState(tmpTX);
    const [settings, setSettings] = useState({cf: 1000, power: -100, mod: 2, fec: 1, dr: 1});

    useEffect(() => {
        tmpAntenna = [...equipment.filter(x => x.unit_type == 'Antenna')][0];
        tmpTX = [...equipment.filter(x => x.unit_type == 'TX' && x.unit_name == tmpAntenna?.feed)][0];
        setTX(tmpTX);
    }, [equipment])

    const handleClickModem = (num: string) => {
        const tmpEquipment = {
            ...tmpAntenna,
            feed: num,
        }
        socket.emit('PATCH', 'equipment', tmpEquipment)
    }

    const handleChangeCF = (e: any) => {
        const tmpSettings = {
            ...settings,
            cf: Number(e.target.value)
        };
        setSettings(tmpSettings);
    };
    const handleChangeDR = (e: any) => {
        const tmpSettings = {
            ...settings,
            dr: Number(e.target.value)
        };
        setSettings(tmpSettings);
    };
    const handleChangePower = (e: any) => {
        const tmpSettings = {
            ...settings,
            power: Number(e.target.value)
        };
        setSettings(tmpSettings);
    };
    const handleChangeFec = (e: any) => {
        const tmpSettings = {
            ...settings,
            fec: Number(e.target.value)
        };
        setSettings(tmpSettings);
    };
    const handleChangeMod = (e: any) => {
        const tmpSettings = {
            ...settings,
            mod: Number(e.target.value)
        };
        setSettings(tmpSettings);
    };


    const handleClickUpdate = () => {
        const tmpEquipment = {
            ...tx,
            cf: settings.cf,
            dr: settings.dr,
            mod: settings.mod,
            fec: settings.fec,
            power: settings.power
        }
        socket.emit('PATCH', 'equipment', tmpEquipment)
        if(tx.active){
            const tmpSignal = {
                id: tx.id,
                server: tx.server,
                conn: tx.conn,
                team: tx.team,
                cf: settings.cf,
                dr: settings.dr,
                mod: settings.mod,
                fec: settings.fec,
                power: settings.power,
                band: tmpAntenna.unit_name,
                sat: tmpAntenna.sat,
                feed: tx.feed,
                stage: "ULRF",
                lb: tmpAntenna?.power === 0 ? false : true,
                active: tmpAntenna.active
            }
            console.log(tmpSignal)
            socket.emit('PATCH', 'satEnv', tmpSignal)
        }
    }

    const handleClickTX = () => {
        const tmpSignal = {
            id: tx.id,
            server: tx.server,
            conn: tx.conn,
            team: tx.team,
            cf: tx.cf,
            dr: tx.dr,
            mod: tx.mod,
            fec: tx.fec,
            band: tmpAntenna.unit_name,
            power: tx.power,
            sat: tmpAntenna.sat,
            feed: tx.feed,
            stage: "ULRF",
            lb: tmpAntenna?.power === 0 ? false : true,
            active: tmpAntenna?.active
        }
        if(tx.active) {
            console.log(tx)
            socket.emit('DELETE', 'satEnv', tmpSignal)
            const tmpEquipment = {
                ...tx,
                active: !tx.active
            }
            socket.emit('PATCH', 'equipment', tmpEquipment)
        } else {
            socket.emit('POST', 'satEnv', tmpSignal)
            const tmpEquipment = {
                ...tx,
                active: !tx.active
            }
            socket.emit('PATCH', 'equipment', tmpEquipment)
        }
    }

    const TxModemSelect = () => {
        let txModemSelect: any = [];
        const modems = equipment.filter((modem: any) => modem.unit_type == "TX");
        ['1', '2', '3', '4', '5', '6', '7', '8'].forEach(x => {
            const modemActive = modems?.filter((modem: any) => modem.unit_name == x)[0]?.active;
            const selected = tx?.unit_name == x;
            let className = 'button'
            selected ?
                modemActive ?
                    className = 'buttonOnSelected'
                    : className = 'buttonSelected'
                : modemActive ?
                    className = 'buttonOn'
                    :className = 'buttonOff'
            txModemSelect.push(<button key={x} className={className} onClick={() => handleClickModem(x)}>{x}</button>)
        })
        return(
            <>
                {txModemSelect}
            </>
        )
    }

    return(
        <div className='Transmitter'>
            <span>Transmitter</span>
            <div className='txBody'>
                <div className='txModemSelect'>
                    <TxModemSelect />
                    
                </div> 
                <div className='txModemOutputs'>
                    <span className='label'>Frequency:</span>    
                    <span className='value'>{tx?.cf}</span>
                    <span className='unit'>MHz</span>
                    <span className='label'>Data Rate:</span>    
                    <span className='value'>{tx?.dr}</span>
                    <span className='unit'>MHz</span>
                    <span className='label'>Modulation:</span>    
                    <span className='value'>{tx?.mod}</span>
                    <span className='unit'></span>
                    <span className='label'>FEC:</span>    
                    <span className='value'>{tx?.fec}</span>
                    <span className='unit'></span>
                    <span className='label'>Power:</span>    
                    <span className='value'>{tx?.power}</span>
                    <span className='unit'>dB</span>
                    <span>TX</span>
                    {
                        tx?.active ? 
                        <button className='buttonOn' onClick={() => handleClickTX()}>ON</button>
                        :<button onClick={() => handleClickTX()}>OFF</button>
                    }
                </div>       
                <div className='txModemOutputs'>
                    <span className='label'>Frequency:</span>    
                    <input type='text' value={settings?.cf} onChange={e => handleChangeCF(e)}></input>
                    <span className='unit'>MHz</span>
                    <span className='label'>Data Rate:</span>    
                    <input type='text' value={settings?.dr} onChange={e => handleChangeDR(e)}></input>
                    <span className='unit'>MHz</span>
                    <span className='label'>Modulation:</span>    
                    <select value={settings?.mod} onChange={e => handleChangeMod(e)}>
                        <option value={1}>BPSK</option>
                        <option value={2}>QPSK</option>
                    </select>
                    <span className='unit'></span>
                    <span className='label'>FEC:</span>    
                    <select value={settings?.fec} onChange={e => handleChangeFec(e)}>
                        <option value={1}>1/2</option>
                        <option value={3}>3/4</option>
                        <option value={7}>7/8</option>
                    </select>
                    <span className='unit'></span>
                    <span className='label'>Power:</span>    
                    <input type='text' value={settings?.power} onChange={e => handleChangePower(e)}></input>
                    <span className='unit'>dB</span>
                    <span></span>
                    <button onClick={() => handleClickUpdate()}>Update</button>
                </div>   
            </div>
        </div>
    );
};

export default Transmitter;