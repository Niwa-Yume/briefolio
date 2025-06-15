import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Notification = {
  type: "success" | "error" | "info";
  message: string;
};

const initialState: Notification | null = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (_, action: PayloadAction<Notification>) => action.payload,
    clearNotification: () => null,
  },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;