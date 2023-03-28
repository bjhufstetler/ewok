import { useNavigate, useLocation } from "react-router-dom";
import { TbHelp } from "react-icons/tb";
import ZuluClock from "./ClockModule/ZuluClock";
import LocalClock from "./ClockModule/LocalClock";
import "./Header.css"
import ScenarioClock from "./ClockModule/ScenarioClock";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClickHelp = () => {
        if(location.pathname === '/help'){
            navigate(-1)
        } else {
            navigate('/help')
        }
    }
    return(
        <div className="header" id='header'>
            <div className="EWOK_Label">EWOK</div>
            <div className="ZuluClock"> <ZuluClock /> </div>   
            <div className="LocalClock"> <LocalClock /></div>
            <div className="ScenarioClock"><ScenarioClock /></div>
            <div className="HelpIcon"><TbHelp onClick={() => handleClickHelp()}/></div>    
        </div>
    )
}

export default Header;