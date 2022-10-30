import { useState } from "react";
import './Antenna.css'

const Antenna = () => {
    const [loopback, setLoopback] = useState<boolean>(true);
    const handleChangeLoopback = (lb: boolean) => {
        if(lb) {
            setLoopback(true);
            setHpa(false);
        } else {
            setLoopback(false);
        };
    };

    const [hpa, setHpa] = useState<boolean>(false);
    const handleChangeHPA = () => {
        setHpa(!hpa);
    }

    const handleChangeTTF = (e: any) => {
        // handle it
    }
    return(
        <div className='Antenna'>
            <div>Antenna</div>
            <div className='antennaBody'>
                <div className='antennaOptions'>
                    <span className='label'>Target</span>
                    <select>
                        <option value='Satellite A'>Satellite A</option>
                        <option value='Satellite B'>Satellite B</option>
                        <option value='Satellite C'>Satellite C</option>
                    </select>
                    <span></span>
                    <span className='label'>Up/Down Converter</span>
                    <select>
                        <option value='C'>C</option>
                        <option value='Ku'>Ku</option>
                        <option value='Ka'>Ka</option>
                    </select>
                    <span></span>
                    <span className='label'>TTF</span>
                    <input type='text' value={String(hpa)} onChange={e => handleChangeTTF(e)}></input>
                    <span className='unit'>MHz</span>
                </div>
                <div className='antennaLoopback'>
                    <input type='radio' onChange={() => handleChangeLoopback(true)} checked={loopback}></input>
                    <span onClick={() => handleChangeLoopback(true)}>Loopback</span>
                    <input type='radio' onChange={() => handleChangeLoopback(false)} checked={!loopback}></input>
                    <span onClick={() => handleChangeLoopback(false)}>Transmit</span>
                </div>
                    {
                        loopback ? 
                        <div className='antennaHPAdisabled'>
                            <input type='checkbox' checked={hpa} onChange={() => handleChangeHPA()} disabled></input>
                            <span className='HPAlabel'>HPA ON</span>
                        </div>
                        :
                        <div className='antennaHPA'>
                            <input type='checkbox' checked={hpa} onChange={() => handleChangeHPA()}></input>
                            <span className='HPAlabel'>HPA ON</span>
                        </div>
                    }
            </div>
        </div>
    );
};

export default Antenna;