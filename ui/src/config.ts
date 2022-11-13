const config = [
    {
        apiUrl: 'http://localhost:8080',
        socketUrl: 'http://localhost:8080'
    },
    {
        apiUrl: 'https://ewok-sim-api.herokuapp.com:8080',
        socketUrl: 'https://ewok-sim-api.herokuapp.com:8080'
    }
];

type config = {
    development: any;
    production: any;
};

export default config;
