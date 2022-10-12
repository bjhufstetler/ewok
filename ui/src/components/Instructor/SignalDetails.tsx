const SignalDetails = () => {
    const handleClickDelete = () => {
        console.log("Delete Clicked")
    }
    const handleClickRevert = () => {
        console.log("Revert Clicked")
    }
    const handleClickSave = () => {
        console.log("Save Clicked")
    }
    return(
        <>
            <div>
                <span>Group</span>
                <input type='text' value='Group_1'></input>
            </div>
            <div>
                <span>Signal</span>
                <input type='text' value='Signal_X1'></input>
            </div>
            <div>
                <span>CF</span>
                <input type='text' placeholder='4500'></input>
                <span>MHz</span>
            </div>
            <div>
                <span>BW</span>
                <input type='text' placeholder='4500'></input>
                <span>MHz</span>
            </div>
            <div>
                <span>Power</span>
                <input type='text' placeholder='4500'></input>
                <span>dB</span>
            </div>
            <div>
                <span>Sat</span>
                <select>
                    <option value='satA'>Satellite A</option>
                    <option value='satB'>Satellite B</option>
                    <option value='satC'>Satellite C</option>
                </select>
                <span>dB</span>
            </div>
            <div>
                <span>Feed</span>
                <select>
                    <option value='none'>No Feed</option>
                    <option value='video01'>Video 01</option>
                    <option value='video02'>Video 02</option>
                    <option value='video03'>Video 03</option>
                    <option value='video04'>Video 04</option>
                </select>
                <span>dB</span>
            </div>
            <div>
                <button onClick = {() => handleClickDelete()}>Delete</button>
                <button onClick = {() => handleClickRevert()}>Revert</button>
                <button onClick = {() => handleClickSave()}>Save</button>
            </div>
        </>
    )
}

export default SignalDetails;