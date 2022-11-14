import { useEffect, useState } from 'react';
import { useEquipmentContext, useEwokContext, useSatEnvContext } from "../../context/EwokContext";
import ReactPlayer from 'react-player';
import './Receiver.css';

const Receiver = () => {
    const { socket } = useEwokContext();
    const { equipment } = useEquipmentContext();
    const { satEnv } = useSatEnvContext();

    useEffect(() => {
        let tmpFeed = 'static.mp4';
        satEnv?.filter(x => x.team === 'Instructor').forEach(signal => {
            if( 
                Math.abs(signal.cf - settings?.cf) < .5 && 
                signal.fec === settings?.fec && 
                signal.mod === settings?.mod) {
                    tmpFeed = signal.feed;
                    satEnv?.filter(x => x.team !== 'Instructor').forEach(x => {
                        if(
                            Math.abs( signal.cf - x.cf ) < .5 &&
                            signal.power - x.power < 3 && signal.power - x.power > -3) {
                                tmpFeed = `degraded ${signal.feed}`
                        } else if (
                            Math.abs( signal.cf - x.cf) < .5 &&
                            x.power - signal.power >=3) {
                                tmpFeed = 'static.mp4'
                        }
                    })
            };    
        });
        setVidFeed(tmpFeed)
    }, [satEnv, equipment])

    const rx = equipment.filter(x => x.unit_type === 'RX')[0];
    const [ settings, setSettings ] = useState(rx);
    const [ vidFeed, setVidFeed ] = useState<string>('static.mp4')
    const handleChangeCF = (e: any) => {
        const tmpEquipment = {
            ...settings,
            cf: Number(e.target.value)
        };
        setSettings(tmpEquipment);
    };

    const handleChangeMod = (e: any) => {
        const tmpEquipment = {
            ...settings,
            mod: Number(e.target.value)
        };
        setSettings(tmpEquipment);
    };

    const handleChangeFec = (e: any) => {
        const tmpEquipment = {
            ...settings,
            fec: Number(e.target.value)
        };
        setSettings(tmpEquipment);
    };

    const handleClickUpdate = () => {
        socket.emit('PATCH', 'equipment', settings)
    }

    return(
        <div className='Receiver'>
            <span>Receiver</span>
            <div className='rxBody'>
                <div className='rxModemOutputs'>
                    <span className='label'>Frequency:</span>    
                    <span className='value'>{rx?.cf}</span>
                    <span className='unit'>MHz</span>
                    <span className='label'>Modulation:</span>    
                    <span className='value'>{rx?.mod === 1 ? 'BPSK' : 'QPSK'}</span>
                    <span className='unit'></span>
                    <span className='label'>FEC:</span>    
                    <span className='value'>{rx?.fec === 1 ? '1/2' : rx?.fec === 3 ? '3/4' : '7/8'}</span>
                    <span className='unit'></span>
                </div>       
                <div className='rxModemOutputs'>
                    <span className='label'>Frequency:</span>    
                    <input type='text' value={settings?.cf} onChange={e => handleChangeCF(e)}></input>
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
                    <span></span>
                    <button onClick={() => handleClickUpdate()}>Update</button>
                </div>
                <div className='rxVideo'>
                    <ReactPlayer
                        config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                        onContextMenu={(e: any) => e.preventDefault()}
                        url={`${process.env.PUBLIC_URL}/videos/${vidFeed}`}
                        width='200px'
                        height='200px'
                        controls={false}
                        playing={true}
                        loop={true}
                        pip={false}
                        muted={true}
                    />
                </div>
            </div>
        </div>
        
    );
};

export default Receiver;