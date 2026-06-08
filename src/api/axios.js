import axios from 'axios';

const api = axios.create({
  baseURL:  'https://bluevult.com/api/flight_api',
});

export default api;
