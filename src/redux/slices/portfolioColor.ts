// redux/slices/portfolioColorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioColorState {
  color: string;
}

const initialState: PortfolioColorState = {
  color: "#000", // fallback color
};

const portfolioColorSlice = createSlice({
  name: "portfolioColor",
  initialState,
  reducers: {
    setPortfolioColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
  },
});

export const { setPortfolioColor } = portfolioColorSlice.actions;
export default portfolioColorSlice.reducer;
