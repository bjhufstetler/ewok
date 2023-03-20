import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const InstructorLogin = () => {
    const code = "EWOKDEV"; // INSTRUCTOR PASSWORD
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>("");
    const [auth, setAuth] = useState<boolean>(false);

    const handleChangePassword = (e: any) => {
        const tmpPassword = e.target.value
        setPassword(tmpPassword)
        if (tmpPassword === code) {
            setAuth(true);
        }else{
            setAuth(false);
        };
    };

    return(
        <div className="Card">
            <input type="password" placeholder="PASSWORD" value={password} onChange={e => handleChangePassword(e)}></input>
            <button onClick={()=> auth?navigate("/instructorCreate"):{}}>CREATE</button>
            <button onClick={()=> auth?navigate("/instructorJoin"):{}}>JOIN</button>
            <button onClick={() => navigate("/")}>BACK</button>
        </div>
    )
};

export default InstructorLogin;