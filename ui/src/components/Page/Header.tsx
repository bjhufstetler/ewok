import { useNavigate, useLocation } from "react-router-dom";
import { TbHelp } from "react-icons/tb";
import './Header.css';
import LocalClock from "./ClockModule/LocalClock";
import ZuluClock from "./ClockModule/ZuluClock";
import ScenarioClock from "./ClockModule/ScenarioClock";
import { useEwokContext } from "../../context/EwokContext";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ewok } = useEwokContext();

    const handleClickHelp = () => {
        if(location.pathname === '/help'){
            navigate(-1)
        } else {
            navigate('/help')
        }
    }
    
    if (ewok.team !== "") {
        return(
            <div className="header" id='header'>
                <div className="EWOK_Label">EWOK</div>
                <div className="LocalClock"><LocalClock /></div>
                <div className="ScenarioClock"><ScenarioClock /></div>
                <div className="ZuluClock"><ZuluClock /></div>
                <div><TbHelp onClick={() => handleClickHelp()}/></div>
            </div>
        )
    }
    else return (
        <div className="header" id='header'>
            <div>EWOK</div>
            <div></div>
            <div></div>
            <div></div>
            <div><TbHelp onClick={() => handleClickHelp()}/></div>
        </div>
    )

    
}

export default Header;