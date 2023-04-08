export const BASE_URL = process.env.REACT_APP_API_URL;
export const API_V1 = BASE_URL + 'api/v1/'

export const LOGIN_URL = API_V1 + 'login'
export const ME_URL = API_V1 + 'me'

export const JOBS_URL = API_V1 + "jobList"
export const JOB_DETAIL_URL = (id) => JOBS_URL + '/' + id