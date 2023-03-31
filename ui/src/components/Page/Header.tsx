import { useNavigate, useLocation } from "react-router-dom";
import { TbHelp } from "react-icons/tb";
import './Header.css';
import LocalClock from "./ClockModule/LocalClock";
import ZuluClock from "./ClockModule/ZuluClock";

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
            <div className="LocalClock"><LocalClock /></div>
            <div className="ZuluClock"><ZuluClock /></div>
            <div></div>
            <div><TbHelp onClick={() => handleClickHelp()}/></div>
        </div>
    )
}

export default Header;