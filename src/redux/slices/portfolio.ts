import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedPortfolio {
  id: number;
  name: string;
}

interface PortfolioState {
  portfolios: SelectedPortfolio[];
  selectedPortfolio: SelectedPortfolio | null;
}

const initialState: PortfolioState = {
  portfolios: [],
  selectedPortfolio: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolios: (
      state,
      action: PayloadAction<SelectedPortfolio[] | undefined>,
    ) => {

      const portfolios = action.payload ?? [];
      state.portfolios = portfolios;


      // If current selected exists in the list, keep it
      const exists = state.selectedPortfolio
        ? portfolios.find(p => p.id === state.selectedPortfolio!.id)
        : null;

      if (exists) {
        state.selectedPortfolio = exists;
      } else if (portfolios.length > 0) {
        state.selectedPortfolio = {
          id: portfolios[0].id,
          name: portfolios[0].name,
        };
      } else {

        state.selectedPortfolio = null;
      }

    },
    
    selectPortfolio: (state, action: PayloadAction<SelectedPortfolio>) => {
      state.selectedPortfolio = action.payload;

    },
    resetPortfolio: state => {
      state.selectedPortfolio = null;
      state.portfolios = [];
    },
  },
});

export const { setPortfolios, selectPortfolio, resetPortfolio } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
