import "../../App.css";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <div>
                SERVER ID
                <select id="team">
                    <option value="0000">0000</option>
                    <option value="0001">0001</option>
                </select>
            </div>
            <button onClick={() => navigate("/instructor")}>JOIN</button>
            <button onClick={() => navigate("/instructorLogin")}>BACK</button>
        </div>
    )
};

export default StudentLogin;