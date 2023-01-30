import { useEffect, useState } from "react";
import { useEquipmentContext, useEwokContext, useSatEnvContext } from "../../context/EwokContext";
import './Antenna.css'

const Antenna = () => {
    // Import [ewok] for server/team information
    const { ewok, socket, satellites } = useEwokContext();
    // Import [equipment] for SpecA settings
    const { equipment } = useEquipmentContext();
    const { satEnv } = useSatEnvContext();

    const antenna = {...equipment?.filter(x => x.unit_type === 'Antenna')[0]};
    const [settings, setSettings] = useState({...antenna});

    useEffect(() => {
        const tmpAntenna = equipment.filter(x => x.unit_type === 'Antenna')[0];
        setSettings(tmpAntenna);
    }, [equipment])

    const handleChangeLoopback = (lb: boolean) => {
        const equipmentIndex = equipment.map(x => x.unit_type).indexOf('Antenna');
        let tmpEquipment: any = {
                ...equipment[equipmentIndex],
                active: false,
                power: lb ? 1 : 0
            }
        socket.emit('PATCH', 'equipment', tmpEquipment)

        satEnv.filter(x => x.team === ewok.team).forEach(signal => {
            const tmpSignal = {
                ...signal,
                lb: lb,
                active: false
            }
            socket.emit('PATCH', 'satEnv', tmpSignal)
        })
    };

    const handleChangeHPA = () => {
        const equipmentIndex = equipment.map(x => x.unit_type).indexOf('Antenna');
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            active: !antenna.active,
        }
        socket.emit('PATCH', 'equipment', tmpEquipment)

        satEnv.filter(x => x.team === ewok.team).forEach(signal => {
            const tmpSignal = {
                ...signal,
                active: !antenna.active
            }
            socket.emit('PATCH', 'satEnv', tmpSignal)
        })
    }

    const handleChangeTTF = (e: any) => {
        const tmpEquipment = {
            ...settings,
            cf: Number(e.target.value),
        };
        setSettings(tmpEquipment);
    }

    const handleChangeConverter = (e: any) => {
        const tmpEquipment = {
            ...settings,
            unit_name: e.target.value,
        };
        setSettings(tmpEquipment);
    }

    const handleChangeTarget = (e: any) => {
        const tmpEquipment = {
            ...settings,
            sat: e.target.value,
        };
        setSettings(tmpEquipment);
    }

    const handleClickUpdate = () => {
        const equipmentIndex = equipment.map(x => x.unit_type).indexOf('Antenna');
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            sat: settings?.sat,
            unit_name: settings?.unit_name,
            cf: Number(settings?.cf)
        };
        socket.emit('PATCH', 'equipment', tmpEquipment)
        satEnv.filter(x => x.team === ewok.team).forEach(signal => {
            const tmpSignal = {
                ...signal,
                band: settings?.unit_name
            };
            socket.emit('PATCH', 'satEnv', tmpSignal);
        })
    }

    return(
        <div className='Antenna'>
            <div>Antenna</div>
            <div className='antennaBody'>
                <div className='antennaOptions'>
                    <span>Target</span>
                    <select className = 'antennaSelect' value={settings?.sat} onChange={e => handleChangeTarget(e)}>
                        <option value='' disabled></option>
                        {satellites.map((satellite: any) => (
                            <option key={satellite.sat} value={satellite.sat}>{satellite.sat}</option>
                        ))}
                    </select>
                    <span></span>
                    <span>Converter</span>
                    <select className = 'antennaSelect' value={settings?.unit_name} onChange={e => handleChangeConverter(e)}>
                    {satellites.map((satellite: any) => (
                            <option key={satellite.band} value={satellite.band}>{satellite.band}</option>
                        ))}
                    </select>
                    <span></span>
                    <span>TTF (Mhz)</span>
                    <input className = 'antennaInput' type='text' value={settings?.cf} onChange={e => handleChangeTTF(e)}></input>
                    <button onClick={() => handleClickUpdate()}>Update</button>
                </div>
                <div className='antennaLoopback'>
                    <input type='radio' onChange={() => handleChangeLoopback(true)} checked={Boolean(antenna?.power)}></input>
                    <span onClick={() => handleChangeLoopback(true)}>Loopback</span>
                    <input type='radio' onChange={() => handleChangeLoopback(false)} checked={!Boolean(antenna?.power)}></input>
                    <span onClick={() => handleChangeLoopback(false)}>Transmit</span>
                </div>
                    {
                        Boolean(antenna?.power) ? 
                        <div className='antennaHPAdisabled'>
                            <input type='checkbox' checked={antenna?.active} onChange={() => handleChangeHPA()} disabled></input>
                            <span className='HPAlabel'>HPA ON</span>
                        </div>
                        :
                        <div className='antennaHPA'>
                            <input type='checkbox' checked={antenna?.active} onChange={() => handleChangeHPA()}></input>
                            <span className='HPAlabel'>HPA ON</span>
                        </div>
                    }
            </div>
        </div>
    );
};

export default Antenna;