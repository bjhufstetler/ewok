import { TbPlus, TbEye } from 'react-icons/tb';
const Sidebar = () => {
    return(
        <>
            <div>
                <span>Signals</span>
                <TbPlus />
            </div>
            <hr></hr>
            <div className='signalGroup'>
                <span>Group_1</span> 
                <TbEye onClick={()=>console.log("Group_1 eye clicked")}/>
                <div className='signal'>
                    <span onClick={()=>console.log("Signal_X1 clicked")}>Signal_X1</span> 
                </div>
                <TbEye onClick={()=>console.log("Signal_X1 eye clicked")}/>
                <div className='signal'>
                    <span>Signal_Y1</span>
                </div> 
                <TbEye />
                <div className='signal'>
                    <span>Signal_Z1</span>
                </div>
                <TbEye />
            </div>
            <div className='signalGroup'>
                <span>Group_2</span> 
                <TbEye />
                <div className='signal'>
                    <span>Signal_X2</span> 
                </div>
                <TbEye />
                <div className='signal'>
                    <span>Spoke_01</span>
                </div> 
                <TbEye />
            </div>
            <button>Save Scenario</button>
        </>
    )
};

export default Sidebar;