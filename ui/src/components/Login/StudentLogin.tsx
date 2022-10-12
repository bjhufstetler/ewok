import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <input type="text" id="server" placeholder="SERVER ID"></input>
            <div>
                TEAM
                <select id="team">
                    <option value="victor">VICTOR</option>
                    <option value="whiskey">WHISKEY</option>
                    <option value="xray">XRAY</option>
                    <option value="yankee">YANKEE</option>
                    <option value="zulu">ZULU</option>
                </select>
            </div>
            <button onClick={() => navigate("/student")}>JOIN</button>
            <button onClick={() => navigate("/")}>BACK</button>
        </div>
    )
};

export default StudentLogin;