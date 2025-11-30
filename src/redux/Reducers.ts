import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import portfolioSlice from "./slices/selecetedportfolio";
import portfolioDetails from "./slices/userPortfolios";
import totalPortfolioSlice from "./slices/portfolioSummary"
import portfolioColorReducer from "./slices/portfolioColor"
import portfolioSector from "./slices/selectedSector"

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio:portfolioSlice,
  userPortfolio:portfolioDetails,
  portfolioSummary:totalPortfolioSlice,
  portfolioColor: portfolioColorReducer,
  portfolioSector:portfolioSector,

});

export default rootReducer;
