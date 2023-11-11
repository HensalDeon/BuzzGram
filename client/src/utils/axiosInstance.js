import axios from "axios";

export const userAxiosInstance = () => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_REACT_APP_SERVER_DOMAIN,
    });

    instance.interceptors.request.use((req) => {
        const userToken = localStorage.getItem("profile");
        if (userToken) {
            req.headers.Authorization = `Bearer ${JSON.parse(userToken).token}`;
        }

        return req;
    });

    return instance;
};

export const adminAxiosInstance = () => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_REACT_APP_SERVER_DOMAIN,
    });

    instance.interceptors.request.use((req) => {
        const adminToken = localStorage.getItem("admin");

        if (adminToken) {
            req.headers.Authorization = `Bearer ${JSON.parse(adminToken).token}`;
        }

        return req;
    });

    return instance;
};
