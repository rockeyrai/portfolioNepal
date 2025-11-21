import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import portfolioSlice from "./slices/portfolio";

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio:portfolioSlice
});

export default rootReducer;
