interface IEwokContext {
    setEwok: any,
    ewok: {    
        team: string,
        server: string,
        satEnv: RFEnv,
        equipment: equipment
    };
};

type EwokProviderProps = {
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