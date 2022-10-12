import { useNavigate, useLocation } from "react-router-dom";
import { TbHelp } from "react-icons/tb";
const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClickHelp = () => {
        if(location.pathname == '/help'){
            navigate(-1)
        } else {
            navigate('/help')
        }
    }
    return(
        <div className="header">
            <div>EWOK</div>
            <div><TbHelp onClick={() => handleClickHelp()}/></div>
        </div>
    )
}

export default Header;