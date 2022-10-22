interface IEwokContext {
    setEwok: any,
    ewok: {    
        team: string,
        server: string,
        satEnv: [{
            id: number,
            server: string,
            conn: string,
            team: string, 
            cf: number, 
            bw: number, 
            power: number, 
            sat: string
        }];
        equipment: [{
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
    };
};

type EwokProviderProps = {
    children?: React.ReactNode;
}