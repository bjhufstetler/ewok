import { useNavigate } from "react-router-dom";
import { useEwokContext } from "../../context/EwokContext";
import { useState } from "react";
import { Socket } from "socket.io-client";

const StudentLogin = () => {
    const navigate = useNavigate();
    const { ewok, setEwok, socket } = useEwokContext();
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
        socket.emit('JOIN', auth.server)
        setEwok(tmpEwok);
        navigate("/student")
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