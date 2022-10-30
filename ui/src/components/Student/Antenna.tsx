import { useState } from "react";
import './Antenna.css'

const Antenna = () => {
    const [loopback, setLoopback] = useState<boolean>(true);
    const handleChangeLoopback = (e: any) => {
        if(e.target.value == 'true') {
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
            <span>Target</span>
            <select>
                <option value='Satellite A'>Satellite A</option>
                <option value='Satellite B'>Satellite B</option>
                <option value='Satellite C'>Satellite C</option>
            </select>
            <span>Up/Down Converter</span>
            <select>
                <option value='C'>C</option>
                <option value='Ku'>Ku</option>
                <option value='Ka'>Ka</option>
            </select>
            <span>TTF</span>
            <input type='text' value={String(hpa)} onChange={e => handleChangeTTF(e)}></input>
            <span>MHz</span>
            <input type='radio' value='true' onChange={e => handleChangeLoopback(e)} checked={loopback}></input>
            <span>Loopback</span>
            <input type='radio' value='false' onChange={e => handleChangeLoopback(e)} checked={!loopback}></input>
            <span>Transmit</span>
            {
                loopback ? 
                <>
                    <input type='checkbox' checked={hpa} onChange={() => handleChangeHPA()} disabled></input>
                    <span className='disabled'>HPA</span>
                </>
                :
                <>
                    <input type='checkbox' checked={hpa} onChange={() => handleChangeHPA()}></input>
                    <span>HPA</span>
                </>
            }
            
        </div>
    );
};

export default Antenna;