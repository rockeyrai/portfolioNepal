import { useQuery } from '@tanstack/react-query';
import api from '../index';

const getNepseDayGraph = () => {
  return useQuery({
    queryKey: ['nepse_oneday_graph'],
    queryFn: async () => {
      const { data } = await api.get(
        '/sector/market_chart_data_minute_one_day/1',
      );

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};
