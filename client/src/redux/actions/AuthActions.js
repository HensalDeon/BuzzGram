import * as AuthApi from "../../api/AuthRequests";
export const logIn = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START" });
    try {
        const { data } = await AuthApi.logIn(formData);
        if (data.error) {
            return { success: false, error: data.error };
        }
        dispatch({ type: "AUTH_SUCCESS", data: data });
        return { success: true };
    } catch (error) {
        dispatch({ type: "AUTH_FAIL", error: true });
        return { success: false, error: error.response.data.error };
    }
};
export const googleAuth = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START" });
    try {
        const { data } = await AuthApi.googleAuth(formData);
        if (data.error) {
            return { success: false, error: data.error };
        }
        dispatch({ type: "AUTH_SUCCESS", data: data });
        return { success: true };
    } catch (error) {
        dispatch({ type: "AUTH_FAIL", error: true });
        return { success: false, error: error.response.data.error };
    }
};

export const adminLogin = (formData) => async (dispatch) => {
    dispatch({ type: "ADMIN_AUTH_START" });
    try {
        const { data } = await AuthApi.adminLogin(formData);
        dispatch({ type: "ADMIN_AUTH_SUCCESS", data: data });
        return { success: true };
    } catch (error) {
        console.log(error);
        dispatch({ type: "ADMIN_AUTH_FAIL", error: true });
        return { success: false };
    }
};

export const signUp = (formData) => async (dispatch) => {
    dispatch({ type: "AUTH_START" });
    try {
        const { data } = await AuthApi.signUp(formData);
        dispatch({ type: "AUTH_SUCCESS", data: data });
        return { success: true };
    } catch (error) {
        console.log(error);
        const errorMessage = error.response.data.error;
        dispatch({ type: "AUTH_FAIL", error: errorMessage });
        return { success: false };
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: "LOG_OUT" });
    dispatch({ type: "RESET_POST_STATE" });
};

export const adminLogout = () => async (dispatch) => {
    dispatch({ type: "ADMIN_LOG_OUT" });
    dispatch({ type: "RESET_STATE" });
};
