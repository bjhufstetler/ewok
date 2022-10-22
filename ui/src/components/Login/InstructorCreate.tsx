import { useNavigate } from "react-router-dom";
import { useEwokContext } from '../../context/EwokContext';

const InstructorCreate = () => {
    const navigate = useNavigate();
    const { ewok, setEwok } = useEwokContext();
    const handleClickContinue = () => {
        //TODO: create new server
    }

    return(
        <div className="Card">
            <div>
                <h1>WARNING!</h1>
                <p>Clicking 'CONTINUE' will create a new server.</p>
                <p>This cannot be undone.</p> 
            </div>
            <button onClick={() => navigate("/instructor")}>CONTINUE</button>
            <button onClick={() => navigate("/instructorLogin")}>BACK</button>
        </div>
    )
};

export default InstructorCreate;