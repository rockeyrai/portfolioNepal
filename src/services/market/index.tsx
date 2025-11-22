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
      if (data?.data) return data.data;

      return data; // fallback
    },
  });
};


type FilterLiveDataProps = {
  filter: string;
  pageSize?: number;
  sortDirection?: 'asc' | 'desc' | 'none';
};

export const getFilterLiveData = ({
  filter,
  pageSize = 10,
  sortDirection = 'none',
}: FilterLiveDataProps) => {
  return useQuery({
    queryKey: ['filter_livedata', filter, pageSize, sortDirection],
    queryFn: async () => {
      const { data } = await api.get(
        `/${filter}/live?page=1&pageSize=${pageSize}&searchText=&sortField=&sortDirection=${sortDirection}`,
      );

      const list = data?.data?.dataList;
      console.log("list",data)
      if (Array.isArray(list)) return list;

      return [];
    },
  });
};


export default {
  getMarketSummary,
  getSubIndexSummary,
  getNepseSummary,
  getFilterLiveData,
};
