import { useEffect, useState } from 'react';
import { useSatEnvContext, useEwokContext, useEquipmentContext } from "../../context/EwokContext";
import './Transmitter.css'

const Transmitter = () => {
    const { equipment, setEquipment } = useEquipmentContext();
    const { ewok } = useEwokContext();
    const { satEnv, setSatEnv } = useSatEnvContext();

    const antenna = equipment.filter(x => x.unit_type == 'Antenna')[0];
    const tx = equipment.filter(x => x.unit_type == 'TX1' && x.unit_name == antenna.feed)[0];
    const [settings, setSettings] = useState({cf: 1000, bw: 1, power: -100});

    const handleClickModem = (num: string) => {
        const tmpEquipment = {
            ...antenna,
            feed: num,
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
        console.log(antenna, tx)
    }

    const handleChangeCF = (e: any) => {
        const tmpSettings = {
            ...settings,
            cf: e.target.value
        };
    };
    const handleChangeBW = (e: any) => {
        const tmpSettings = {
            ...settings,
            bw: e.target.value
        };
    };
    const handleChangePower = (e: any) => {
        const tmpSettings = {
            ...settings,
            power: e.target.value
        };
    };

    return(
        <div className='Transmitter'>
            <span>Transmitter</span>
            <div className='txBody'>
                <div className='txModemSelect'>
                    <button onClick={() => handleClickModem('1')}>1</button>
                    <button onClick={() => handleClickModem('2')}>2</button>
                    <button onClick={() => handleClickModem('3')}>3</button>
                    <button onClick={() => handleClickModem('4')}>4</button>
                    <button onClick={() => handleClickModem('5')}>5</button>
                    <button onClick={() => handleClickModem('6')}>6</button>
                    <button onClick={() => handleClickModem('7')}>7</button>
                    <button onClick={() => handleClickModem('8')}>8</button>
                </div> 
                <div className='txModemOutputs'>
                    <span className='label'>Frequency:</span>    
                    <span className='value'>{tx?.cf}</span>
                    <span className='unit'>MHz</span>
                    <span className='label'>Bandwidth:</span>    
                    <span className='value'>{tx?.bw}</span>
                    <span className='unit'>MHz</span>
                    <span className='label'>Power:</span>    
                    <span className='value'>{tx?.power}</span>
                    <span className='unit'>dB</span>
                    <span></span>
                    <button>TX ON</button>
                </div>       
                <div className='txModemOutputs'>
                    <span className='label'>Frequency:</span>    
                    <input type='text' value={settings.cf} onChange={e => handleChangeCF(e)}></input>
                    <span className='unit'>MHz</span>
                    <span className='label'>Bandwidth:</span>    
                    <input type='text' value={settings.bw} onChange={e => handleChangeBW(e)}></input>
                    <span className='unit'>MHz</span>
                    <span className='label'>Power:</span>    
                    <input type='text' value={settings.power} onChange={e => handleChangePower(e)}></input>
                    <span className='unit'>dB</span>
                    <span></span>
                    <button>Update</button>
                </div>   
            </div>
        </div>
    );
};

export default Transmitter;