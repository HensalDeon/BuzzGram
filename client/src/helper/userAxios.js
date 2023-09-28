import axios from "axios";
import { Promise } from "es6-promise";
import jwt_decode from "jwt-decode";
import env from "../../env";

axios.defaults.baseURL = env.REACT_APP_SERVER_DOMAIN

/** Make API Requests */

/** To get username from Token */
export async function getUsername() {
    const token = localStorage.getItem("token");
    if (!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token);
    return decode;
}

/** AUthenticate function  */
export async function authenticate(username) {
    try {
        return await axios.post("/authenticate", { username });
    } catch (error) {
        return { error: "Username doesn't exist...!" };
    }
}

/** get User details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Password doesn't match...!" };
    }
}

/** register User function */
export async function registerUser(credentials) {
    try {
        console.log("jnkjkjb");
        const response = await axios.post(`/register`, credentials);

        return Promise.resolve(response.message);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** login function */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post("/login", { username, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't match...!" });
    }
}

/** update user profile function */
export async function updateUser(response) {
    try {
        const token = await localStorage.getItem("token");
        const data = await axios.put("/update-user", response, { headers: { Authorization: `Bearer ${token}` } });
        return Promise.resolve({ data });
    } catch (error) {
        return Promise.reject({ error: "Couldn't update Profile...!" });
    }
}

/** generate OTP */
export async function otpSignup(phone) {
    try {
        const res = await axios.post("/otp-signup", phone);
        if (res.status === 200) return Promise.resolve(res.message);
        return Promise.reject(res.error);
    } catch (error) {
        return Promise.reject(error);
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get("/verifyOTP", { params: { username, code } });
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}

/** reset password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put("/reset-password", { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}
