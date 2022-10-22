import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEwokContext } from "../../context/EwokContext";

const StudentLogin = () => {
    const navigate = useNavigate();
    const { ewok, setEwok } = useEwokContext();
    const [server, setServer] = useState<string>("");
    const handleChangeServer = (e: any) => {
        setServer(e.target.value)
    }
    const handleClickJoin = () => {
        const tmpEwok = {...ewok, server: server}
        setEwok(tmpEwok)
        navigate("/instructor")
    }
    return(
        <div className="Card">
            <div>
                SERVER ID
                <select onChange={(e) => handleChangeServer(e)}>
                    {// TODO: Get server options from db
                    }
                    <option disabled selected></option>
                    <option value="0a2b">'0a2b'</option>
                    <option value="0a2c">'0a2c'</option>
                </select>
            </div>
            
            <button onClick={() => handleClickJoin()}>JOIN</button> 
            <button onClick={() => navigate("/instructorLogin")}>BACK</button>
        </div>
    )
};

export default StudentLogin;