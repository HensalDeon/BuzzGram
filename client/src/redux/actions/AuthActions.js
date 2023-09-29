import * as AuthApi from "../../api/AuthRequests";
export const logIn = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    return { success: true };
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL", error: true });
    return { success: false};
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

export const logout = ()=> async(dispatch)=> {
  dispatch({type: "LOG_OUT"})
}
