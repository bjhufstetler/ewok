interface IEwokContext {
    ewok: {    
        team: string,
        server: string,
        baseURL: string,
    },
    setEwok: any,
};

interface IEquipmentContext {
    equipment: equipment,
    setEquipment: any,
}

interface ISatEnvContext {
    satEnv: RFEnv,
    setSatEnv: any,
}

type EwokProviderProps = {
    children?: React.ReactNode;
}
type EquipmentProviderProps = {
    children?: React.ReactNode;
}
type SatEnvProviderProps = {
    children?: React.ReactNode;
}

type RFEnv = [{
    id: number,
    server: string,
    conn: string,
    team: string, 
    cf: number, 
    bw: number, 
    power: number, 
    sat: string,
    feed: string,
    stage: string
}];

type equipment = [{
    id: number,
    conn: string,
    server: string,
    team: string,
    unit_type: string,
    unit_name: string,
    cf: number,
    bw: number,
    power: number,
    sat: string,
    feed: string,
    active: boolean
}];