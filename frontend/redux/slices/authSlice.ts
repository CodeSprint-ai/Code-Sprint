// redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

const initial: AuthState = { accessToken: null, refreshToken: null, user: null };

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    login(state, action: PayloadAction<AuthState>) {
      Object.assign(state, action.payload);
      localStorage.accessToken = state.accessToken!;
      localStorage.refreshToken = state.refreshToken!;
      localStorage.user = JSON.stringify(state.user!);
    },
    logout(state) {
      state.accessToken = state.refreshToken = state.user = null;
      localStorage.clear();
    },
    restore(state) {
      state.accessToken = localStorage.getItem('accessToken');
      state.refreshToken = localStorage.getItem('refreshToken');
      state.user = JSON.parse(localStorage.getItem('user') || 'null');
    },
  },
});

export const { login, logout, restore } = slice.actions;
export default slice.reducer;
