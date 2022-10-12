import { useNavigate } from 'react-router-dom';
const Landing = () => {
    const navigate = useNavigate();
    return(
        <div className="Card">
            <div>ROLE</div>
            <button onClick={() => navigate("/studentLogin")}>STUDENT</button>
            <button onClick={() => navigate("/instructorLogin")}>INSTRUCTOR</button>
        </div>
    )
};

export default Landing;