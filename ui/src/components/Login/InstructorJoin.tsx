import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEwokContext } from "../../context/EwokContext";

const StudentLogin = () => {
    const navigate = useNavigate();
    const { ewok, setEwok } = useEwokContext();
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