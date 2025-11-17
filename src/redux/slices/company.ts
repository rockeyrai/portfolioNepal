import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services";

export type CompanyType = {
  id: number;
  sectorName: string;
  symbol: string;
  companyName: string;
};

interface CompanyState {
  companies: CompanyType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: CompanyState = {
  companies: [],
  status: "idle",
  error: undefined,
};

// Async thunk to fetch companies once
export const fetchCompanies = createAsyncThunk<CompanyType[]>(
  "company/fetchCompanies",
  async () => {
    const res = await api.get("/company/get_company_symbols");
    const data = res.data?.data || [];

    // Map API data into CompanyType and add logo
    return data.map((item: any, index: number) => ({
      id: index + 1,
      sectorName: item.sectorName,
      symbol: item.symbol,
      companyName: item.companyName,
    }));
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<CompanyType[]>) => {
        state.status = "succeeded";
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default companySlice.reducer;
