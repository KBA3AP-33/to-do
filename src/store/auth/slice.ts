import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@src/api/auth';
import { api } from '@src/api/common';
import { Tokens } from '@src/utils/tokens';
import type { RootState } from '..';
import { projectApi } from '../projects/api';
import { QUERY_KEYS } from '@src/consts';
import type { AuthResponse, AuthState, LoginRequest, User } from '@src/types';

type UserUpdate = Pick<User, 'username' | 'lastname' | 'phone' | 'image'>;

const AUTH_ERRORS = {
  NETWORK: 'Ошибка сети',
  LOGIN: 'Ошибка авторизации',
  REGISTER: 'Ошибка регистрации',
  PROFILE_UPDATE: 'Ошибка обновления профиля',
} as const;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isLoadingApi: false,
  error: null,
};

const handleAuthSuccess = (state: AuthState, { user, accessToken, refreshToken }: AuthResponse['data']) => {
  state.user = user;
  state.accessToken = accessToken;
  state.refreshToken = refreshToken;
  state.isLoading = false;
  state.isLoadingApi = false;
  state.error = null;

  if (accessToken && refreshToken) {
    Tokens.setTokens(accessToken, refreshToken);
  }
};

const handleAuthPending = (state: AuthState) => {
  state.isLoadingApi = true;
  state.error = null;
};

const handleAuthRejected = (state: AuthState, errorMessage?: string, clearTokens: boolean = false) => {
  state.isLoading = false;
  state.isLoadingApi = false;
  state.error = errorMessage || null;

  if (clearTokens) {
    state.user = null;
    Tokens.clearTokens();
  }
};

export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return (await api.post<AuthResponse>('/auth/login', credentials)).data;
    } catch {
      return rejectWithValue(AUTH_ERRORS.NETWORK);
    }
  }
);

export const register = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return (await api.post<AuthResponse>('/auth/register', userData)).data;
    } catch {
      return rejectWithValue(AUTH_ERRORS.NETWORK);
    }
  }
);

export const logout = createAsyncThunk<boolean, void, { state: RootState }>(
  'auth/logout',
  async (_, { getState, dispatch }) => {
    const refreshToken = getState().auth.refreshToken;
    const { data } = await authApi.post('/auth/logout', { data: refreshToken });

    dispatch(projectApi.util.invalidateTags([QUERY_KEYS.PROJECTS]));
    return data;
  }
);

export const profile = createAsyncThunk<AuthResponse, void>('auth/profile', async () => {
  return (await authApi.get<AuthResponse>('/auth/profile')).data;
});

export const updateProfile = createAsyncThunk<AuthResponse, UserUpdate, { rejectValue: string }>(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      return (await authApi.put<AuthResponse>('/auth/update-profile', userData)).data;
    } catch {
      return rejectWithValue(AUTH_ERRORS.PROFILE_UPDATE);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      Tokens.setTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    clearAuth: state => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      Tokens.clearTokens();
    },
  },
  extraReducers: builder => {
    // Profile
    builder
      .addCase(profile.pending, state => handleAuthPending(state))
      .addCase(profile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        const { user } = action.payload.data;
        state.user = user;
        state.isLoading = false;
        state.isLoadingApi = false;
      })
      .addCase(profile.rejected, state => handleAuthRejected(state, undefined, true));

    // Update Profile
    builder
      .addCase(updateProfile.pending, state => handleAuthPending(state))
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        const { user } = action.payload.data;
        state.user = user;
        state.isLoadingApi = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoadingApi = false;
        state.error = action.payload || AUTH_ERRORS.PROFILE_UPDATE;
      });

    // Login
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
        handleAuthPending(state);
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        handleAuthSuccess(state, action.payload.data);
      })
      .addCase(login.rejected, (state, action) => {
        handleAuthRejected(state, action.payload || AUTH_ERRORS.LOGIN);
      });

    // Register
    builder
      .addCase(register.pending, state => {
        state.isLoading = true;
        handleAuthPending(state);
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        handleAuthSuccess(state, action.payload.data);
      })
      .addCase(register.rejected, (state, action) => {
        handleAuthRejected(state, action.payload || AUTH_ERRORS.REGISTER);
      });

    // Logout
    builder
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.isLoading = false;
        state.isLoadingApi = false;
        Tokens.clearTokens();
      })
      .addCase(logout.rejected, state => {
        state.user = null;
        state.isLoading = false;
        state.isLoadingApi = false;
        Tokens.clearTokens();
      });
  },
});

export const { clearError, setTokens, clearAuth } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
