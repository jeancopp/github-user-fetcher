import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const get = (resource: string) =>
    axios.get(`${GITHUB_API_URL}${resource}`, {
        validateStatus: status => status < 500,
    });
