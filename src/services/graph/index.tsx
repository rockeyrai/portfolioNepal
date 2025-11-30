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

const getCompanyGraph = (symbo:string,time:string) => {
  return useQuery({
    queryKey: ['company_graph',symbo,time],
    enabled: Boolean(symbo && time),

    queryFn: async () => {
      const { data } = await api.get(
        `company/get_company_graph_range/${symbo}/${time}`,
      );

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};

const getSectorGraphData = (sectorName: string, timePeriod: string) => {
  const sectorList = [
    { label: "Commercial Banks", id: "6" },
    { label: "Non Life Insurance", id: "10" },
    { label: "Micro Finance", id: "3" },
    { label: "Hydro Power", id: "9" },
    { label: "Hotels And Tourism", id: "7" },
    { label: "Tradings", id: "12" },
    { label: "Development Banks", id: "1" },
    { label: "Life Insurance", id: "4" },
    { label: "Finance", id: "11" },
    { label: "Investment", id: "13" },
    { label: "Mutual Fund", id: "5" },
    { label: "Others", id: "8" },
    { label: "Manufacturing And Processing", id: "2" },
  ];

  // 🔎 Find matching sector ID
  const matchedSector = sectorList.find(
    (item) => item.label.toLowerCase() === sectorName.toLowerCase()
  );

  const sectorId = matchedSector?.id ?? null;

  return useQuery({
    queryKey: ['sector_graph', sectorId, timePeriod],
    enabled: Boolean(sectorId && timePeriod),
    queryFn: async () => {
      const { data } = await api.get(
        `sector/chart_data/${sectorId}/${timePeriod}`
      );
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
  });
};



export default  {getNepseDayGraph,getSectorGraphData,getCompanyGraph}