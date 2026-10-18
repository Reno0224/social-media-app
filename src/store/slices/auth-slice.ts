import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isHydrated: boolean;
}

const initialState: AuthState = { token: null, isHydrated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.isHydrated = true;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
});

export const { hydrate, setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
