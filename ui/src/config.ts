const config = [
    {
        apiUrl: 'http://localhost:8080',
        socketUrl: 'http://localhost:8080'
    },
    {
        apiUrl: 'https://ewok-sim-api.herokuapp.com',
        socketUrl: 'https://ewok-sim-api.herokuapp.com'
    }
];

type config = {
    development: any;
    production: any;
};

export default config;
