import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  createPostOpen: boolean;
}

const initialState: UiState = { createPostOpen: false };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCreatePost(state) {
      state.createPostOpen = true;
    },
    closeCreatePost(state) {
      state.createPostOpen = false;
    },
  },
});

export const { openCreatePost, closeCreatePost } = uiSlice.actions;
export default uiSlice.reducer;
