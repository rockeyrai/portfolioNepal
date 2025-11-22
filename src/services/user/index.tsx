import { useQuery } from '@tanstack/react-query';
import api from '../index';

const getUserTotalPortfolio = (portfolioId: string | number) => {
  return useQuery({
    queryKey: ['total_portfolio', portfolioId],
    queryFn: async () => {
      const { data } = await api.get(
        `/mobile/user/total_portfolio/${portfolioId}`,
      );

      if (data?.data) return data.data;

      return data;
    },
    enabled: !!portfolioId, // important safety
  });
};

const getUserLinkPortfolio = () => {
  return useQuery({
    queryKey: ['link_portfolio'],
    queryFn: async () => {
      const { data } = await api.get('/adv-portfolio/portfolio/user');
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};

export default { getUserLinkPortfolio, getUserTotalPortfolio };
