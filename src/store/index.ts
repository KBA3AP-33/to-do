import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@src/store/auth/slice';
import { projectApi } from './projects/api';
import { tasksApi } from './tasks/api';
import { loggerMiddleware } from '@src/store/middlewares/logger-middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(loggerMiddleware).concat(projectApi.middleware).concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
