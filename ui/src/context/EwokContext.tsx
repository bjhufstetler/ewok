import PropTypes from "prop-types";
import { FunctionComponent, useContext, useState, useMemo, createContext } from "react";

const defaultEwokContext = {
    team: "Victor",
    server: "0a2b",
    satEnv: [
        {id: 0, server: '0a2b', conn: 'x', team: 'Instructor', cf: 6250, bw: 5, power: -90, sat: "Satellite A", feed: 'Feed 01', stage: "ULRF"}
    ],
    equipment: [
        {id: 1, conn: 'asbkj', server: '0a2b', team: 'Instructor', unit_type: 'Group_X', unit_name: 'Signal_01', cf: 6550, bw: 10, power: -90, sat: 'Satellite A', feed: 'Feed 01', active: false},
        {id: 2, conn: 'sfsdk', server: '0a2b', team: 'Instructor', unit_type: 'Group_X', unit_name: 'Signal_02', cf: 6560, bw: .5, power: -90, sat: 'Satellite A', feed: 'Feed 02', active: false},
        {id: 3, conn: '237sf', server: '0a2b', team: 'Instructor', unit_type: 'Group_X', unit_name: 'Signal_03', cf: 6565, bw: .5, power: -90, sat: 'Satellite A', feed: 'Feed 03', active: false},
        {id: 4, conn: '7sdfn', server: '0a2c', team: 'Instructor', unit_type: 'Group_2', unit_name: 'TheBigOne', cf: 12300, bw: 50, power: -87, sat: 'Satellite B', feed: 'Feed 04', active: false},
        {id: 5, conn: '23fsj', server: '0a2c', team: 'Instructor', unit_type: 'Group_2', unit_name: 'TheLittleOne', cf: 30565, bw: .5, power: -90, sat: 'Satellite C', feed: 'Feed 05', active: false},
        {id: 6, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX1', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 7, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX1', unit_name: '2', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 8, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX1', unit_name: '3', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 9, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX1', unit_name: '4', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 10, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX2', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 11, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX2', unit_name: '2', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 12, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX2', unit_name: '3', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 13, conn: '', server: '0a2b', team: 'Victor', unit_type: 'RX2', unit_name: '4', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 14, conn: 'vic01', server: '0a2b', team: 'Victor', unit_type: 'TX1', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 15, conn: 'vic02', server: '0a2b', team: 'Victor', unit_type: 'TX1', unit_name: '2', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 16, conn: 'vic03', server: '0a2b', team: 'Victor', unit_type: 'TX1', unit_name: '3', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 17, conn: 'vic04', server: '0a2b', team: 'Victor', unit_type: 'TX1', unit_name: '4', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 18, conn: 'vic05', server: '0a2b', team: 'Victor', unit_type: 'TX2', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 19, conn: 'vic06', server: '0a2b', team: 'Victor', unit_type: 'TX2', unit_name: '2', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 20, conn: 'vic07', server: '0a2b', team: 'Victor', unit_type: 'TX2', unit_name: '3', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 21, conn: 'vic08', server: '0a2b', team: 'Victor', unit_type: 'TX2', unit_name: '4', cf: 5000, bw: 0, power: 0, sat: 'Antenna 1', feed: '', active: true},
        {id: 22, conn: '', server: '0a2b', team: 'Victor', unit_type: 'Antenna 1', unit_name: '1', cf: 5000, bw: 0, power: 0, sat: 'Satellite A', feed: '', active: true},
        {id: 23, conn: '', server: '0a2b', team: 'Victor', unit_type: 'Antenna 2', unit_name: '2', cf: 4500, bw: 0, power: 0, sat: 'Satellite A', feed: '', active: true},
        {id: 22, conn: '', server: '0a2b', team: 'Victor', unit_type: 'SpecA', unit_name: '1', cf: 6500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
        {id: 23, conn: '', server: '0a2b', team: 'Victor', unit_type: 'SpecA', unit_name: '2', cf: 4500, bw: 1000, power: 0, sat: 'ULRF', feed: '', active: true},
    ]
};

/*
    Equipment definitions
    Instructor
        unit_type: Signal Group
        unit_name: Signal Name
    RX
        unit_type: RX Case
        unit_name: RX Modem
        sat: Antenna
    TX
        unit_type: TX Case
        unit_name: TX Modem
        sat: Antenna
        active: TX ON
    Antenna
        unit_type: Antenna
        cf: u/c offset
        bs: d/c offset
        power: 0:Loopback, 1:TX
        active: HPA On
    SpecA
        sat: Signal uplink/downlink UL/DL, intermediate/radio IF/RF
*/

const EwokContext = createContext({} as IEwokContext);

const EwokProvider: FunctionComponent<EwokProviderProps> = ({ children }) => {
    const [ewok, setEwokState] = useState(defaultEwokContext);

    const setEwok = (update: any) => {
        console.log("updating Ewok", update);
        const dbEquipmentDELETE = ewok.equipment.filter(x => !update.equipment.includes(x))[0];
        // const dbEquipmentPOST = update.equipment.filter(x => !ewok.equipment.includes(x))[0];
        // console.log("Equipment to be deleted: ", dbEquipmentDELETE)
        // console.log("Equipment to be deleted: ", dbEquipmentPOST)
        // TODO: handle patch, post, delete, and socket emit here

        // TODO: on ULRF change, update DLRF
        // TODO: on DLRF change, update DLIF
        setEwokState(update)
    };

    const value: any = useMemo(() => ({
        ewok, setEwok
    }), [ewok]);

    return (
        <EwokContext.Provider value = {value}>
            {children}
        </EwokContext.Provider>
    )
}

const useEwokContext = (): IEwokContext => useContext(EwokContext);

EwokProvider.propTypes = {
    children: PropTypes.node
};

export { EwokProvider, EwokContext, useEwokContext };