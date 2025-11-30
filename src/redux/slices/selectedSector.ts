// redux/slices/selectedSector.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioSectorState {
  Sector: string;
}

const initialState: PortfolioSectorState = {
  Sector: "Portfolio", 
};

const portfolioSectorSlice = createSlice({
  name: "portfolioSector",
  initialState,
  reducers: {
    setPortfolioSector: (state, action: PayloadAction<string>) => {
      state.Sector = action.payload;
    },
  },
});

export const { setPortfolioSector } = portfolioSectorSlice.actions;
export default portfolioSectorSlice.reducer;
