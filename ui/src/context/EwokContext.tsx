import PropTypes from "prop-types";
import { FunctionComponent, useContext, useState, useMemo, createContext } from "react";
import { useFetch } from "../hooks/useFetch";
import { io } from 'socket.io-client';

const defaultEwokContext = {
    team: "Victor",
    server: "0a2b",
    baseURL: 'http://localhost:8080'
};

const EwokContext = createContext({} as IEwokContext);
const EwokProvider: FunctionComponent<EwokProviderProps> = ({ children }) => {
    const [ ewok, setEwokState ] = useState(defaultEwokContext);
    
    const setEwok = (update: any) => {
        setEwokState(update)
    };
    const socket = io('http://localhost:3000');
    const satellites = [
        {sat: 'ASH', band: 'C', uc: 5100, dc: -5100, ttf: 20, fspl: 15},
        {sat: 'DRSC', band: 'Ku', uc: 11050, dc: -11050, ttf: 15.25, fspl: 9},
        {sat: 'ArCOM', band: 'Ka', uc: 30025, dc: -30025, ttf: 7.5, fspl: 6}
    ];
    
    const value: any = useMemo(() => ({
        ewok, setEwok, socket, satellites
    }), [ewok]);
    
    return (
        <EwokContext.Provider value = {value}>
            {children}
        </EwokContext.Provider>
    )
}

const EquipmentContext = createContext({} as IEquipmentContext);
const EquipmentProvider: FunctionComponent<EquipmentProviderProps> = ({ children }) => {
    const { ewok, socket } = useEwokContext();
    const { data: equipment, setData: setEquipment } = useFetch(`/equipment?server=${ewok.server}&team=${ewok.team}`);
    socket.on('equipment_patch', (update: any) => {
        if ( update.server == ewok.server && update.team == ewok.team) {
            const index = equipment.map((x: any) => x.id).indexOf(update.id)
            const tmpEquipment = [...equipment];
            tmpEquipment[index] = update;
            setEquipment(tmpEquipment);
            console.log('patch heard')
        } 
    });
    socket.on('equipment_post', (update: any) => {
        if ( update.server == ewok.server && update.team == ewok.team) {
            const tmpEquipment = [...equipment];
            tmpEquipment.push(update);
            setEquipment(tmpEquipment);
        }
    });
    socket.on('equipment_delete', (update: any) => {
        if ( update.server == ewok.server && update.team == ewok.team) {
            const index = equipment.map((x: any) => x.id).indexOf(update.id)
            const tmpEquipment = [...equipment];
            tmpEquipment.splice(index,1);
            setEquipment(tmpEquipment);
        }
    });


    const value: any = useMemo(() => ({
        equipment, setEquipment
    }), [equipment, ewok]);
    
    return (
        <EquipmentContext.Provider value = {value}>
            {children}
        </EquipmentContext.Provider>
    )
}

const SatEnvContext = createContext({} as ISatEnvContext);
const SatEnvProvider: FunctionComponent<SatEnvProviderProps> = ({ children }) => {
    const { ewok, socket } = useEwokContext();
    const { data: satEnv, setData: setSatEnv } = useFetch(`/satEnv?server=${ewok.server}`);
    socket.on('satEnv_patch', (update: any) => {
        if ( update.server == ewok.server ) {
            const index = satEnv.map((x: any) => x.id).indexOf(update.id)
            const tmpSatEnv = [...satEnv];
            tmpSatEnv[index] = update;
            setSatEnv(tmpSatEnv);
        }
    });
    socket.on('satEnv_post', (update: any) => {
        if ( update.server == ewok.server ) {
            const tmpSatEnv = [...satEnv];
            tmpSatEnv.push(update);
            setSatEnv(tmpSatEnv);
        }
        console.log('I heard that')
    });
    socket.on('satEnv_delete', (update: any) => {
        if ( update.server == ewok.server ) {
            const index = satEnv.map((x: any) => x.id).indexOf(update.id)
            const tmpSatEnv = [...satEnv];
            tmpSatEnv.splice(index,1);
            setSatEnv(tmpSatEnv);
        }
    });

    const value: any = useMemo(() => ({
        satEnv, setSatEnv
    }), [satEnv, ewok]);
    
    return (
        <SatEnvContext.Provider value = {value}>
            {children}
        </SatEnvContext.Provider>
    )
}

const useEwokContext = (): IEwokContext => useContext(EwokContext);
const useEquipmentContext = (): IEquipmentContext => useContext(EquipmentContext);
const useSatEnvContext = (): ISatEnvContext => useContext(SatEnvContext);

EwokProvider.propTypes = {
    children: PropTypes.node
};
EquipmentProvider.propTypes = {
    children: PropTypes.node
};
SatEnvProvider.propTypes = {
    children: PropTypes.node
};

export { 
    EwokProvider, EwokContext, useEwokContext, 
    EquipmentProvider, EquipmentContext, useEquipmentContext,
    SatEnvProvider, SatEnvContext, useSatEnvContext
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