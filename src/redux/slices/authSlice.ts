import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, removeToken, setToken } from "../../core/auth/utils";
import {jwtDecode} from "jwt-decode";

export interface TokenType {
  access: string;
  refresh: string;
  user_id: string;
}

// Define user info structure (based on your decoded JSON)
export interface UserInfo {
  id: number;
  user_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  login_type: string;
  member_type: string;
  investor_type: string;
  password: string;
  phone_number: string;
  is_subscribed: number;
  promocode: string | null;
  fcm_token: string | null;
  is_admin: number;
  is_portfolio_subscribed: number;
  iat: number;
}

interface AuthState {
  token: TokenType | null;
  user: UserInfo | null;
  status: "idle" | "loading" | "signIn" | "signOut";
  user_id: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  user_id: null,
};

// Thunk to hydrate auth from SecureStore
export const hydrateAuthAction = createAsyncThunk<TokenType | null>(
  "auth/hydrate",
  async () => {
    try {
      const token = await getToken();
      return token;
    } catch (error) {
      console.error("Error hydrating auth:", error);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<TokenType>) => {
      const tokenData = action.payload;
      setToken(tokenData);

      // Decode token to extract user info
      try {
        const decoded = jwtDecode<UserInfo>(tokenData.access);
        state.user = decoded;
      } catch (err) {
        console.error("JWT Decode Error:", err);
        state.user = null;
      }

      state.token = tokenData;
      state.user_id = tokenData.user_id;
      state.status = "signIn";
    },
    signOut: (state) => {
      removeToken();
      state.token = null;
      state.user = null;
      state.user_id = null;
      state.status = "signOut";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuthAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hydrateAuthAction.fulfilled, (state, action) => {
        if (action.payload) {
          try {
            const decoded = jwtDecode<UserInfo>(action.payload.access);
            state.user = decoded;
          } catch (err) {
            console.error("JWT Decode Error:", err);
            state.user = null;
          }

          state.token = action.payload;
          state.user_id = action.payload.user_id;
          state.status = "signIn";
        } else {
          state.token = null;
          state.user = null;
          state.user_id = null;
          state.status = "signOut";
        }
      })
      .addCase(hydrateAuthAction.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.user_id = null;
        state.status = "signOut";
      });
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
