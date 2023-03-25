import Receiver from "./Receiver";
import Transmitter from "./Transmitter";
import Antenna from "./Antenna";
import SpecA from "./SpecA";
import Subheader from "../Page/Subheader";
import './StudentPage.css';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEwokContext } from "../../context/EwokContext";

const StudentPage = () => {
    const ewok = useEwokContext()
    const navigate = useNavigate();

    useEffect(() => {
        if(ewok.ewok.server === ''){
            navigate('/')
        }
    }, [])

    const handleClickChat = () => {
        window.open(`chat?Student?${ewok.ewok.server}`,'popup','width=300,height=400,ressize=no');
    };

    return(
        <div className='studentPage'>
            <Subheader/>
            <div>
                <button onClick={() => handleClickChat()}>Chat</button>
                <Antenna/>
            </div>
            <SpecA unit_name="2"/>
            <SpecA unit_name="4"/>
            <div></div>
            <SpecA unit_name="1"/>
            <SpecA unit_name="3"/>
            <div></div>
            <Transmitter/>
            <Receiver/>
        </div>
    )
}

export default StudentPage;