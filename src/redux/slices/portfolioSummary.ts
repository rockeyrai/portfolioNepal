import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface TotalPortfolioState {
  total: number;
  bySymbol: Record<string, number>;
  percentage: number;
  totalPortfolioValue: number;
}

const initialState: TotalPortfolioState = {
  total: 0,
  bySymbol: {},
  percentage: 0,
  totalPortfolioValue: 0,
};

const totalPortfolioSlice = createSlice({
  name: "totalPortfolio",
  initialState,
  reducers: {
    setTotalPortfolio(state, action: PayloadAction<TotalPortfolioState>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setTotalPortfolio } = totalPortfolioSlice.actions;
export default totalPortfolioSlice.reducer;
export const selectPortfolioSummary = (state: RootState) => state.portfolioSummary;
