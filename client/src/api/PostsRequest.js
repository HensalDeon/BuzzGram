import axios from 'axios'
import env from '../../env';


const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });