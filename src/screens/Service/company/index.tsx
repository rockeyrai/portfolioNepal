import api from "../../../services";
import { useQuery } from "@tanstack/react-query";
export function getActiveCompanyNames() {
  return useQuery({
    queryKey: ["activeCompanies"],
    queryFn: async () => {
      const { data } = await api.get("/company/get_active_company_name");
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return []; // fallback
    },
  });
}
