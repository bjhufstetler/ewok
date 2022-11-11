import { useNavigate } from "react-router-dom";
import { useEwokContext } from '../../context/EwokContext';

const InstructorCreate = () => {
    const navigate = useNavigate();
    const { ewok, setEwok, socket } = useEwokContext();

    const makeServer:Function = () => {
        var result : string = '';
        var characters : string = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz023456789';
        for ( var i = 0; i < 4; i++ ) result += characters.charAt(Math.floor(Math.random() * 62));
        return result;
    };

    const handleClickContinue = () => {
        const serverId = makeServer();
        const tmpEquipment = [
            {conn: '', server: serverId, team: 'Victor', unit_type: 'RX', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
            {conn: 'vic01', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '1', cf: 1000, dr: 1, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic02', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '2', cf: 1000, dr: 2, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic03', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '3', cf: 1000, dr: 3, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic04', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '4', cf: 1000, dr: 4, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic05', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '5', cf: 1000, dr: 5, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic06', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '6', cf: 1000, dr: 6, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic07', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '7', cf: 1000, dr: 7, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'vic08', server: serverId, team: 'Victor', unit_type: 'TX', unit_name: '8', cf: 1000, dr: 8, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: '', server: serverId, team: 'Victor', unit_type: 'Antenna', unit_name: 'C', cf: 0, bw: 0, power: 1, sat: 'ASH', feed: '1', active: false},
            {conn: '', server: serverId, team: 'Victor', unit_type: 'SpecA', unit_name: '1', cf: 1500, bw: 1000, power: 0, sat: 'ULIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Victor', unit_type: 'SpecA', unit_name: '2', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Victor', unit_type: 'SpecA', unit_name: '3', cf: 1500, bw: 1000, power: 0, sat: 'DLIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Victor', unit_type: 'SpecA', unit_name: '4', cf: 6500, bw: 1000, power: 0, sat: 'DLRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Whiskey', unit_type: 'RX', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
            {conn: 'whi01', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '1', cf: 1000, dr: 1, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi02', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '2', cf: 1000, dr: 2, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi03', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '3', cf: 1000, dr: 3, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi04', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '4', cf: 1000, dr: 4, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi05', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '5', cf: 1000, dr: 5, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi06', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '6', cf: 1000, dr: 6, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi07', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '7', cf: 1000, dr: 7, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'whi08', server: serverId, team: 'Whiskey', unit_type: 'TX', unit_name: '8', cf: 1000, dr: 8, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: '', server: serverId, team: 'Whiskey', unit_type: 'Antenna', unit_name: 'C', cf: 0, bw: 0, power: 1, sat: 'ASH', feed: '1', active: false},
            {conn: '', server: serverId, team: 'Whiskey', unit_type: 'SpecA', unit_name: '1', cf: 1500, bw: 1000, power: 0, sat: 'ULIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Whiskey', unit_type: 'SpecA', unit_name: '2', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Whiskey', unit_type: 'SpecA', unit_name: '3', cf: 1500, bw: 1000, power: 0, sat: 'DLIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Whiskey', unit_type: 'SpecA', unit_name: '4', cf: 6500, bw: 1000, power: 0, sat: 'DLRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Xray', unit_type: 'RX', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
            {conn: 'xra01', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '1', cf: 1000, dr: 1, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra02', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '2', cf: 1000, dr: 2, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra03', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '3', cf: 1000, dr: 3, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra04', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '4', cf: 1000, dr: 4, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra05', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '5', cf: 1000, dr: 5, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra06', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '6', cf: 1000, dr: 6, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra07', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '7', cf: 1000, dr: 7, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'xra08', server: serverId, team: 'Xray', unit_type: 'TX', unit_name: '8', cf: 1000, dr: 8, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: '', server: serverId, team: 'Xray', unit_type: 'Antenna', unit_name: 'C', cf: 0, bw: 0, power: 1, sat: 'ASH', feed: '1', active: false},
            {conn: '', server: serverId, team: 'Xray', unit_type: 'SpecA', unit_name: '1', cf: 1500, bw: 1000, power: 0, sat: 'ULIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Xray', unit_type: 'SpecA', unit_name: '2', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Xray', unit_type: 'SpecA', unit_name: '3', cf: 1500, bw: 1000, power: 0, sat: 'DLIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Xray', unit_type: 'SpecA', unit_name: '4', cf: 6500, bw: 1000, power: 0, sat: 'DLRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Yankee', unit_type: 'RX', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
            {conn: 'yan01', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '1', cf: 1000, dr: 1, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan02', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '2', cf: 1000, dr: 2, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan03', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '3', cf: 1000, dr: 3, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan04', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '4', cf: 1000, dr: 4, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan05', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '5', cf: 1000, dr: 5, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan06', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '6', cf: 1000, dr: 6, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan07', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '7', cf: 1000, dr: 7, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'yan08', server: serverId, team: 'Yankee', unit_type: 'TX', unit_name: '8', cf: 1000, dr: 8, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: '', server: serverId, team: 'Yankee', unit_type: 'Antenna', unit_name: 'C', cf: 0, bw: 0, power: 1, sat: 'ASH', feed: '1', active: false},
            {conn: '', server: serverId, team: 'Yankee', unit_type: 'SpecA', unit_name: '1', cf: 1500, bw: 1000, power: 0, sat: 'ULIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Yankee', unit_type: 'SpecA', unit_name: '2', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Yankee', unit_type: 'SpecA', unit_name: '3', cf: 1500, bw: 1000, power: 0, sat: 'DLIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Yankee', unit_type: 'SpecA', unit_name: '4', cf: 6500, bw: 1000, power: 0, sat: 'DLRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Zulu', unit_type: 'RX', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
            {conn: 'zul01', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '1', cf: 1000, dr: 1, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul02', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '2', cf: 1000, dr: 2, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul03', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '3', cf: 1000, dr: 3, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul04', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '4', cf: 1000, dr: 4, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul05', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '5', cf: 1000, dr: 5, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul06', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '6', cf: 1000, dr: 6, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul07', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '7', cf: 1000, dr: 7, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: 'zul08', server: serverId, team: 'Zulu', unit_type: 'TX', unit_name: '8', cf: 1000, dr: 8, mod: 1, fec: 1, power: -85, sat: 'ASH', feed: '', active: false},
            {conn: '', server: serverId, team: 'Zulu', unit_type: 'Antenna', unit_name: 'C', cf: 0, bw: 0, power: 1, sat: 'ASH', feed: '1', active: false},
            {conn: '', server: serverId, team: 'Zulu', unit_type: 'SpecA', unit_name: '1', cf: 1500, bw: 1000, power: 0, sat: 'ULIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Zulu', unit_type: 'SpecA', unit_name: '2', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Zulu', unit_type: 'SpecA', unit_name: '3', cf: 1500, bw: 1000, power: 0, sat: 'DLIF', feed: '', active: true},
            {conn: '', server: serverId, team: 'Zulu', unit_type: 'SpecA', unit_name: '4', cf: 6500, bw: 1000, power: 0, sat: 'DLRF', feed: '', active: true},
        ];
        tmpEquipment.forEach(x => socket.emit('POST', 'equipment', x));
        const tmpEwok = {
            ...ewok,
            team: 'Instructor',
            server: serverId
        };
        setEwok(tmpEwok);
        socket.emit('JOIN', serverId, 'Instructor')
        navigate('/instructor')
    };

    return(
        <div className="Card">
            <div>
                <h1>WARNING!</h1>
                <p>Clicking 'CONTINUE' will create a new server.</p>
                <p>This cannot be undone.</p> 
            </div>
            <button onClick={() => handleClickContinue()}>CONTINUE</button>
            <button onClick={() => navigate("/instructorLogin")}>BACK</button>
        </div>
    )
};

export default InstructorCreate;