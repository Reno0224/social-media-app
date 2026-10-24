
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import uiReducer from "./slices/ui-slice";

export const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];