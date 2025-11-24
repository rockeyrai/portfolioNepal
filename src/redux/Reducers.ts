import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import portfolioSlice from "./slices/selecetedportfolio";
import portfolioDetails from "./slices/userPortfolios";

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio:portfolioSlice,
  userPortfolio:portfolioDetails
});

export default rootReducer;
