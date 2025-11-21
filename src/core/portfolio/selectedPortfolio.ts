import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState, store } from "../../redux/store";
import { Portfolio, selectPortfolio, setPortfolios } from "../../redux/slices/portfolio";
import { setSelectedPortfolio as storeSelectedPortfolio, getSelectedPortfolio } from "./portfolioStorage";

interface UsePortfolioReturn {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  selectPortfolio: (portfolio: Portfolio) => void;
  setPortfolios: (portfolios: Portfolio[]) => void;
}

export const usePortfolio = (): UsePortfolioReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { portfolios, selectedPortfolio } = useSelector((state: RootState) => state.portfolio);

  const selectPortfolioHandler = async (portfolio: Portfolio) => {
    dispatch(selectPortfolio(portfolio));
    await storeSelectedPortfolio(portfolio); // persist
  };

  const setPortfoliosHandler = async (list: Portfolio[]) => {
    dispatch(setPortfolios(list));

    // persist selected portfolio
    const currentSelected = selectedPortfolio ?? list[0];
    if (currentSelected) {
      await storeSelectedPortfolio(currentSelected);
    }
  };

  return {
    portfolios,
    selectedPortfolio,
    selectPortfolio: selectPortfolioHandler,
    setPortfolios: setPortfoliosHandler,
  };
};

// Direct dispatch helpers (optional)
export const selectPortfolioDirect = (portfolio: Portfolio) =>
  (store.dispatch as AppDispatch)(selectPortfolio(portfolio));

export const setPortfoliosDirect = (portfolios: Portfolio[]) =>
  (store.dispatch as AppDispatch)(setPortfolios(portfolios));
