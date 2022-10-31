import { useEffect, useState } from "react";
import { useEquipmentContext, useEwokContext } from "../../context/EwokContext";
import './Antenna.css'

const Antenna = () => {
    // Import [ewok] for server/team information
    const { ewok } = useEwokContext();
    // Import [equipment] for SpecA settings
    const { equipment, setEquipment } = useEquipmentContext();

    const antenna = {...equipment.filter(x => x.unit_type == 'Antenna')[0]};
    const [settings, setSettings] = useState(antenna);
    useEffect(() => {
        const initAntenna = equipment.filter(x => x.unit_type == 'Antenna')[0];
        setSettings(initAntenna);
    }, [])

    const handleChangeLoopback = (lb: boolean) => {
        const equipmentIndex = equipment.map(x => x.unit_type).indexOf('Antenna');
        let tmpEquipment: any = {};
        if(lb) {
            tmpEquipment = {
                ...equipment[equipmentIndex],
                active: false,
                power: 1
            }
        } else {
            tmpEquipment = {
                ...equipment[equipmentIndex],
                power: 0
            }
        };
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
        });
    };

    const handleChangeHPA = () => {
        const equipmentIndex = equipment.map(x => x.unit_type).indexOf('Antenna');
        const tmpEquipment = {
            ...equipment[equipmentIndex],
            active: !antenna.active,
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
        });
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
        });
    }

    return(
        <div className='Antenna'>
            <div>Antenna</div>
            <div className='antennaBody'>
                <div className='antennaOptions'>
                    <span>Target</span>
                    <select className = 'antennaSelect' value={settings?.sat} onChange={e => handleChangeTarget(e)}>
                        <option value='' disabled></option>
                        <option value='Satellite A'>Satellite A</option>
                        <option value='Satellite B'>Satellite B</option>
                        <option value='Satellite C'>Satellite C</option>
                    </select>
                    <span></span>
                    <span>Converter</span>
                    <select className = 'antennaSelect' value={settings?.unit_name} onChange={e => handleChangeConverter(e)}>
                        <option value='C'>C</option>
                        <option value='Ku'>Ku</option>
                        <option value='Ka'>Ka</option>
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