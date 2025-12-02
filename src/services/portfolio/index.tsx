import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPortfolioDetails } from '../../redux/slices/userPortfolios';

interface AddSecondaryStockParams {
  userStockId: number;
  Price: string;
  Quantity: string;
  Symbol: string;
  Name: string;
}

export const useAddSecondaryStock = () => {
  const queryClient = useQueryClient();
  const selectedPortfolio = useSelector(
    (state: RootState) => state.portfolio.selectedPortfolio
  );
  const portfolioId = selectedPortfolio?.id ?? 0;
  const dispatch = useDispatch()
      const fetchstockDAta = async () => {
      const { data } =
        await api.get(`/adv-portfolio/portfolio/stocks/${portfolioId}?performanceType=&timePeriod=
`);
      // console.log('use effect data', data?.data?.dataList);
      dispatch(setPortfolioDetails(data?.data?.dataList));
    };
  const getToday = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    );
  };


  // Define mutation function separately
  const addSecondaryStockFn = async ({
    userStockId,
    Price,
    Quantity,
    Symbol,
    Name,
  }: AddSecondaryStockParams) => {
    console.log("🚀 Starting API call");
    
    const { data } = await api.post(
      `/adv-portfolio/portfolio/${portfolioId}/transaction/${userStockId}/mul-transaction`,
      {
        isExisting: false,
        price: Price,
        quantity: Quantity,
        symbol: Symbol,
        transaction_date: getToday(),
        transaction_id: userStockId,
        transaction_type: 'Secondary Buy',
        user_name: Name,
      }
    );
    
    console.log("✅ API response:", data);
    return data?.data ?? data;
  };

  // Use mutation with the function
  return useMutation({
    mutationFn: addSecondaryStockFn,
    onSuccess: (data) => {
      console.log("✅ Mutation success:", data);
      fetchstockDAta()
      // Optionally invalidate queries
      // queryClient.invalidateQueries(['portfolio']);
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
    },
  });
};


interface SellStockParams {
  stockId: number;
  multiStockId: number;
  price: string;
  quantity: string;
  capitalGain: string;
}

export const useSellSecondaryStock = () => {
  console.log("working till this phase")
  const dispatch = useDispatch();
  const selectedPortfolio = useSelector(
    (state: RootState) => state.portfolio.selectedPortfolio
  );
  const portfolioId = selectedPortfolio?.id ?? 0;
console.log("portfolio id ", portfolioId)
  const fetchStockData = async () => {
    const { data } = await api.get(
      `/adv-portfolio/portfolio/stocks/${portfolioId}?performanceType=&timePeriod=`
    );
    dispatch(setPortfolioDetails(data?.data?.dataList));
  };

  console.log("selling stock,")
const sellFn = async ({
  stockId,
  multiStockId,
  price,
  quantity,
  capitalGain,
}: SellStockParams) => {
  // Build dynamic URL
  const url = multiStockId
    ? `/adv-portfolio/portfolio/${portfolioId}/sell/${stockId}/mul-transaction/${multiStockId}`
    : `/adv-portfolio/portfolio/${portfolioId}/sell/${stockId}`;

  const { data } = await api.patch(url, {
    capitalGain,
    price,
    quantity,
  });

  return data?.data ?? data;
};


  return useMutation({
    mutationFn: sellFn,
    onSuccess: fetchStockData,
  });
};
