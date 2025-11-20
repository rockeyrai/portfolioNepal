import api from '..';
import { useQuery } from '@tanstack/react-query';

const getSubIndexSummary = () => {
  return useQuery({
    queryKey: ['sub_index'],
    queryFn: async () => {
      const { data } = await api.get('/mobile/market/sub_index');
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return []; // fallback
    },
  });
};

const getMarketSummary = () => {
  return useQuery({
    queryKey: ['market'],
    queryFn: async () => {
      const { data } = await api.get('/mobile/market/market_summary');
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};

const getNepseSummary = () => {
  return useQuery({
    queryKey: ['nepse'],
    queryFn: async () => {
      const { data } = await api.get('/mobile/market/nepse_summary');
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};

const getFilterLiveData = () => {
  return useQuery({
    queryKey: ['filter_livedata'],
    queryFn: async () => {
      const { data } = await api.get(
        `/gainer/live?page=1&pageSize=10&searchText=&sortField=&sortDirection=none`,
      );
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};

export default { getMarketSummary, getSubIndexSummary, getNepseSummary };
