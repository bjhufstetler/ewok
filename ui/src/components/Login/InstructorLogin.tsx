import "../../App.css";
import { useNavigate } from "react-router-dom";

const InstructorLogin = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <input type="text" defaultValue="PASSWORD"></input>
            <button onClick={()=> navigate("/instructorCreate")}>CREATE</button>
            <button onClick={()=> navigate("/instructorJoin")}>JOIN</button>
            <button onClick={() => navigate("/")}>BACK</button>
        </div>
    )
};

export default InstructorLogin;