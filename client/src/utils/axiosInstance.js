import axios from "axios";
import env from "../../env";

export const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: env.REACT_APP_SERVER_DOMAIN,
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

