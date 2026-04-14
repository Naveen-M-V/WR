// API Configuration
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (isLocal ? 'http://localhost:4000/api' : 'https://stage.whichrenewables.com/api');
const API_HOST = process.env.REACT_APP_API_HOST || (isLocal ? 'http://localhost:4000' : 'https://stage.whichrenewables.com');

export { API_BASE_URL, API_HOST };
