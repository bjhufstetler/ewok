import { useNavigate } from "react-router-dom";
import { useEquipmentContext, useEwokContext, useSatEnvContext } from "../../context/EwokContext";
import { useState } from "react";

const StudentLogin = () => {
    const navigate = useNavigate();
    const { ewok, setEwok, socket } = useEwokContext();
    const { setEquipment } = useEquipmentContext();
    const { setSatEnv } = useSatEnvContext();
    const [ auth, setAuth ] = useState<{team: string, server: string}>({team: "Victor", server: ""})
    const handleChangeServer = (e:any) => {
        const tmpAuth = {
            ...auth,
            server: e.target.value
        };
        setAuth(tmpAuth);
    }
    const handleChangeTeam = (e:any) => {
        const tmpAuth = {
            ...auth,
            team: e.target.value
        };
        setAuth(tmpAuth);
    }
    const handleClickJoin = () => {
        const tmpEwok = {
            ...ewok,
            team: auth.team,
            server: auth.server
        };
        socket.emit('JOIN', auth.server, auth.team)
        setEwok(tmpEwok);
        fetch(`${ewok.baseURL}/equipment?server=${auth.server}&team=${auth.team}`)
            .then(res => res.json())
            .then(data => setEquipment(data))
        fetch(`${ewok.baseURL}/satEnv?server=${auth.server}`)
            .then(res => res.json())
            .then(data => setSatEnv(data))
        navigate("/student");
    };
    return(
        <div className="Card">
            <input type="text" id="server" placeholder="SERVER ID" value={auth.server} onChange={e => handleChangeServer(e)}></input>
            <div>
                TEAM
                <select id="team" value={auth.team} onChange={e => handleChangeTeam(e)}>
                    <option value="Victor">VICTOR</option>
                    <option value="Whiskey">WHISKEY</option>
                    <option value="Xray">XRAY</option>
                    <option value="Yankee">YANKEE</option>
                    <option value="Zulu">ZULU</option>
                </select>
            </div>
            <button onClick={() => handleClickJoin()}>JOIN</button>
            <button onClick={() => navigate("/")}>BACK</button>
        </div>
    )
};

export default StudentLogin;