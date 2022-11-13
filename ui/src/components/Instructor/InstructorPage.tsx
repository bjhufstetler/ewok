import './InstructorPage.css';
import SignalDetails from './SignalDetails';
import Satellites from './Satellites';
import { Subheader } from '..';

const InstructorPage = () => {
    return(
        <>
            <Subheader />
            <div className="instructorPage">
                <SignalDetails />
                <div className="satellites"><Satellites /></div>
            </div>
        </>
    )
};

export default InstructorPage;