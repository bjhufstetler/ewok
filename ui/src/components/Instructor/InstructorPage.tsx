import './InstructorPage.css';
import SignalDetails from './SignalDetails';
import Satellites from './Satellites';
import { Chat, Subheader } from '..';
import { useNavigate } from "react-router-dom";
import { useEwokContext } from '../../context/EwokContext';
import { useEffect } from 'react';

const InstructorPage = () => {
    const ewok = useEwokContext()
    const navigate = useNavigate();

    useEffect(() => {
        if(ewok.ewok.server === ''){
            navigate('/')
        }
    }, [])
    return(
        <>
            <Subheader />
            <div className="instructorPage">
                <Chat/>
                <SignalDetails />
                <div className="satellites"><Satellites /></div>
            </div>
        </>
    )
};

export default InstructorPage;