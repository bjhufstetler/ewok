import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEquipmentContext, useEwokContext, useSatEnvContext } from "../../context/EwokContext";

const StudentLogin = () => {
    const navigate = useNavigate();
    const { ewok, setEwok, socket } = useEwokContext();
    const { setEquipment } = useEquipmentContext();
    const { setSatEnv } = useSatEnvContext();
    const [server, setServer] = useState<string>('');
    const [serverList, setServerList] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/server')
            .then(res => res.json())
            .then(servers => {
                console.log(servers)
                setServerList(servers)
            });
    }, [])
    const handleChangeServer = (e: any) => {
        setServer(e.target.value)
    }
    const handleClickJoin = () => {
        const tmpEwok = {...ewok, team: 'Instructor', server: server}
        setEwok(tmpEwok)
        socket.emit('JOIN', server, 'Instructor')
        fetch(`${ewok.baseURL}/equipment?server=${server}&team=Instructor`)
            .then(res => res.json())
            .then(data => setEquipment(data))
        fetch(`${ewok.baseURL}/satEnv?server=${server}`)
            .then(res => res.json())
            .then(data => setSatEnv(data))
        navigate("/student");
        navigate("/instructor")
    }
    return(
        <div className="Card">
            <div>
                SERVER ID
                <select onChange={(e) => handleChangeServer(e)} value={server}>
                    {// TODO: Get server options from db
                    }
                    <option disabled value=''></option>
                    {serverList.map((servers, id) => (
                        <option key={id} value={servers}>{servers}</option>
                    ))}
                </select>
            </div>
            
            <button onClick={() => handleClickJoin()}>JOIN</button> 
            <button onClick={() => navigate("/instructorLogin")}>BACK</button>
        </div>
    )
};

export default StudentLogin;