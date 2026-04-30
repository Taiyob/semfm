import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string | null;
  userId: string | null;
  user: any | null;
  permissions: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  role: null,
  userId: null,
  user: null,
  permissions: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any }>
    ) => {
      const { user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.permissions = user.permissions || [];
      state.role = user.role?.name || null;
      state.userId = user.id || null;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.userId = null;
      state.user = null;
      state.permissions = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
