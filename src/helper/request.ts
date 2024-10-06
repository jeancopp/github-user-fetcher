import axios, {AxiosResponse} from 'axios';
import logger from "./logger";

const GITHUB_API_URL = 'https://api.github.com';

axios.interceptors.request.use(config => {
  logger.debug(`Requesting: ${config.url}`);
  return config;
});

axios.interceptors.response.use(response => {
  logger.debug(`Response:${response.status}`);
  return response;
});


export const get = (resource: string): Promise<AxiosResponse> =>
  axios.get(`${GITHUB_API_URL}${resource}`, {
    validateStatus: status => status < 500,
  });
