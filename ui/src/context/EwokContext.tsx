import PropTypes from "prop-types";
import { FunctionComponent, useContext, useState, useMemo, createContext, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { io } from 'socket.io-client';
//import config from '../config';
//const configIndex = process.env.REACT_APP_NODE_ENV ? 1 : 0;
//const configIndex = 0;
//const socketUrl: string = config[configIndex].socketUrl;

const tmpIp = window.location.href.split(':3000', 1)[0];

const defaultEwokContext = {
    team: "",
    server: "",
    baseURL: `${tmpIp}:8080`
};

const EwokContext = createContext({} as IEwokContext);
const EwokProvider: FunctionComponent<EwokProviderProps> = ({ children }) => {
    const [ ewok, setEwokState ] = useState(defaultEwokContext);
    
    const setEwok = (update: any) => {
        setEwokState(update)
    };
    
    const satellites = [
        {sat: 'ASH', band: 'C', uc: 5100, dc: -5100, ttf: 20, fspl: 15},
        {sat: 'DRSC', band: 'Ku', uc: 11050, dc: -11050, ttf: 15, fspl: 9},
        {sat: 'ArCOM', band: 'Ka', uc: 29025, dc: -29025, ttf: -7, fspl: 6}
    ];
    
    //const socket = io(socketUrl);
    let socket = io(ewok.baseURL);
    useEffect(() => {
        socket = io(ewok.baseURL);
    }, [ewok])

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
    const { ewok } = useEwokContext();
    const { data: equipment, setData: setEquipment } = useFetch(`/equipment?server=${ewok.server}&team=${ewok.team}`);
    

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
    const { ewok } = useEwokContext();
    const { data: satEnv, setData: setSatEnv } = useFetch(`/satEnv?server=${ewok.server}`);
    

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