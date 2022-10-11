import '../App.css'
import { useNavigate } from 'react-router-dom';
const Landing = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <button onClick={() => navigate("/studentLogin")}>STUDENT</button>
            <button onClick={() => navigate("/instructorLogin")}>INSTRUCTOR</button>
            <button onClick={() => navigate("/readme")}>README</button>
        </div>
    )
};

export default Landing;