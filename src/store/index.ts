import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

// Types pour TypeScript (optionnel mais recommandé)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;