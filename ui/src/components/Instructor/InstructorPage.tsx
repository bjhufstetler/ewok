import './InstructorPage.css';
import Sidebar from './Sidebar';
import SignalDetails from './SignalDetails';
import Satellites from './Satellites';
import { Subheader } from '../';

const InstructorPage = () => {
    return(
        <>
            <Subheader />
            <div className="instructorPage">
                <div className="sidebar"><Sidebar /></div>
                <div className="signalDetails"><SignalDetails /></div>
                <div className="satellites"><Satellites /></div>
            </div>
        </>
    )
};

export default InstructorPage;