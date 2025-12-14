import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@src/api/auth';
import { api } from '@src/api/common';
import { Tokens } from '@src/utils/tokens';
import type { RootState } from '..';
import { projectApi } from '../projects/api';
import { QUERY_KEYS } from '@src/consts';
import type { AuthResponse, AuthState, LoginRequest } from '@src/types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isLoadingApi: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return (await api.post('/auth/login', credentials)).data;
    } catch {
      return rejectWithValue('Ошибка сети');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return (await api.post('/auth/register', userData)).data;
    } catch {
      return rejectWithValue('Ошибка сети');
    }
  }
);

export const logout = createAsyncThunk<boolean, void, { state: RootState }>(
  'auth/logout',
  async (_, { getState, dispatch }) => {
    const { data } = await authApi.post('/auth/logout', { data: getState().auth.refreshToken });

    dispatch(projectApi.util.invalidateTags([QUERY_KEYS.PROJECTS]));
    return data;
  }
);

export const profile = createAsyncThunk('auth/profile', async () => {
  return (await authApi.get('/auth/profile')).data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // profile
      .addCase(profile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        const { user } = action.payload.data;
        state.isLoading = false;
        state.user = user;
      })
      .addCase(profile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(profile.rejected, state => {
        state.user = null;
        state.isLoading = false;
        Tokens.clearTokens();
      })
      // login
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.isLoadingApi = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isLoadingApi = false;
        const { user, accessToken, refreshToken } = action.payload.data;

        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        if (accessToken && refreshToken) Tokens.setTokens(accessToken, refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingApi = false;
        state.error = action.payload || 'Ошибка авторизации';
      })
      // register
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.isLoadingApi = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isLoadingApi = false;
        const { user, accessToken, refreshToken } = action.payload.data;

        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        if (accessToken && refreshToken) Tokens.setTokens(accessToken, refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingApi = false;
        state.error = action.payload || 'Ошибка регистрации';
      })
      // logout
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.isLoading = false;
        state.isLoadingApi = false;
        Tokens.clearTokens();
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
