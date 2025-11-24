import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PortfolioStock = {
  transactionId: number;
  symbol: string;
  quantity: number;
  price: string;
  wacc: string;
  lastTradedPrice: number;
  sectorName?: string;
  securityName?: string;
  // ...other fields
};

type PortfolioState = {
  byId: Record<number, PortfolioStock>;
  allIds: number[];
};

const initialState: PortfolioState = {
  byId: {},
  allIds: [],
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolioDetails: (state, action: PayloadAction<PortfolioStock[]>) => {
      state.byId = {};
      state.allIds = [];

      action.payload.forEach((stock) => {
        state.byId[stock.transactionId] = stock;
        state.allIds.push(stock.transactionId);
      });
    },
  },
});

export const { setPortfolioDetails } = portfolioSlice.actions;
export default portfolioSlice.reducer;
