import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../redux/slices/authSlice";
import { authApi } from "@/app/services/authApi";

export interface RootState {
  auth: ReturnType<typeof authReducer>;
  [authApi.reducerPath]: ReturnType<typeof authApi.reducer>;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
