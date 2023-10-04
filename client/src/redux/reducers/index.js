import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import postReducer from "./PostReducer";
import reportReducer from "./ReportReducer";

export const reducers = combineReducers({ authReducer, postReducer, reportReducer });
