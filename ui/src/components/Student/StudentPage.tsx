import Receiver from "./Receiver";
import Transmitter from "./Transmitter";
import Antenna from "./Antenna";
import SpecA from "./SpecA";
import Subheader from "../Page/Subheader";
import './StudentPage.css';

const StudentPage = () => {
    return(
        <div className='studentPage'>
            <Subheader/>
            <Antenna/>
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