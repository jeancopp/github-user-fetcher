import axios, {AxiosResponse} from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const get = (resource: string): Promise<AxiosResponse> =>
  axios.get(`${GITHUB_API_URL}${resource}`, {
    validateStatus: status => status < 500,
  });
