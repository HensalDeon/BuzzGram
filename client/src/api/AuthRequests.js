import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_REACT_APP_SERVER_DOMAIN });

export const logIn = (formData) => API.post("/auth/login", formData);
export const googleAuth = (formData) => API.post("/auth/google-auth", formData);
export const signUp = (formData) => API.post("/auth/register", formData);
export const adminLogin = (formData) => API.post("/auth/admin-login", formData);
export const sendOtpSignup = (phone) => API.post("/auth/otp-signup", phone);
export const sendOtpRecovery = (phone) => API.post("/auth/otp-recovery", phone);
export const verifyOtp = (phone, otp) => API.post("/auth/verify-otp", { phone, otp });
export const forgotPassword = (formData) => API.put("/auth/forgot-password", formData);
export const getGeneratedToken = (userId) => API.get(`/auth/generate-token/${userId}`);
