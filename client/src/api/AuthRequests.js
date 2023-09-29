import axios from 'axios'
import env from '../../env';


const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

export const logIn= (formData)=> API.post('/auth/login',formData);

export const signUp = (formData) => API.post('/auth/register', formData);

export const sendOtpSignup = (phone) => API.post('/auth/otp-signup', phone);

export const verifyOtp = (phone,otp) => API.post('/auth/verify-otp', {phone,otp});

