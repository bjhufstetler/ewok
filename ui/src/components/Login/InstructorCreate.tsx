import "../../App.css";
import { useNavigate } from "react-router-dom";

const InstructorCreate = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <div>
                SCENARIO
                <select id="scenario">
                    <option value="new">New</option>
                    <option value="savedsceanario1">Save 1</option>
                </select>
            </div>
            <button onClick={() => navigate("/instructor")}>START</button>
            <button onClick={() => navigate("/instructorLogin")}>BACK</button>
        </div>
    )
};

export default InstructorCreate;