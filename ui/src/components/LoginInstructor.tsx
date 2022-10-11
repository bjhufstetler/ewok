import "../App.css";
import { useNavigate } from "react-router-dom";

const LoginInstructor = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <input type="text" defaultValue="PASSWORD"></input>
            <button>CREATE</button>
            <button>JOIN</button>
            <button onClick={() => navigate("/")}>BACK</button>
        </div>
    )
};

export default LoginInstructor;