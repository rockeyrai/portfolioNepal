import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import companyReducer from './slices/company'

const rootReducer = combineReducers({
  company: companyReducer,
  auth: authReducer,
});

export default rootReducer;
