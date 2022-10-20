import { useEwokContext } from "../../context/EwokContext";

const Subheader = () => {
    const { ewok } = useEwokContext();
    return(
        <div className='subheader'>
            <div>Team: {ewok?.team}</div>
            <div>Server: {ewok?.server}</div>
        </div>
    )
};

export default Subheader;