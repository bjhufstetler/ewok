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
            <SpecA unit_name="1"/>
            <SpecA unit_name="2"/>
            <Antenna/>
            <Antenna/>
            <Transmitter/>
            <Transmitter/>
            <Receiver/>
            <Receiver/>
        </div>
    )
}

export default StudentPage;