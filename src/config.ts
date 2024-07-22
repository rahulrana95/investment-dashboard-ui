

type Mode = 'PRODUCTION' | 'DEVELOPMENT' | 'STAGING' | 'TESTING';

const modeValues: { [key in Mode]: Mode } = {
    PRODUCTION: 'PRODUCTION',
    DEVELOPMENT: 'DEVELOPMENT',
    STAGING: 'STAGING',
    TESTING: 'TESTING'
};

const mode: Mode = process.env.REACT_APP_MODE as Mode || modeValues.PRODUCTION;

let baseURL: string = 'https://api-v2.jswarrior.com';

if (mode === modeValues.DEVELOPMENT) {
    baseURL = 'http://localhost:4001';
}



const config: {
    mode: Mode
    baseURL: string
    GA_TRACKING_ID: string
} = {
    mode,
    baseURL,
    GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID || ""
};


export { config };