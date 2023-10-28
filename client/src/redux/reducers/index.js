import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import postReducer from "./PostReducer";
import reportReducer from "./ReportReducer";
import adminReducer from "./AdminReducer";
import chatReducer from "./ChatUserReducer";

export const reducers = combineReducers({ authReducer, postReducer, reportReducer, adminReducer, chatReducer });
