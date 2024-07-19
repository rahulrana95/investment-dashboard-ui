

type Mode = 'PRODUCTION' | 'DEVELOPMENT' | 'STAGING' | 'TESTING';

const modeValues: { [key in Mode]: Mode } = {
    PRODUCTION: 'PRODUCTION',
    DEVELOPMENT: 'DEVELOPMENT',
    STAGING: 'STAGING',
    TESTING: 'TESTING'
};

const mode: Mode = process.env.REACT_APP_MODE as Mode || modeValues.PRODUCTION;

let baseURL: string = 'https://investment-dashboard-egx8.onrender.com';

if (mode === modeValues.DEVELOPMENT) {
    baseURL = 'http://localhost:4001';
}



const config: {
    mode: Mode
    baseURL: string
} = {
    mode,
    baseURL
};


export {config};