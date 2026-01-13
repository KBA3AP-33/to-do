import { isAnyOf } from '@reduxjs/toolkit';
import { profile } from '@src/store/auth/slice';
import { tasksApi } from '@src/store/tasks/api';
import type { Middleware, MiddlewareAPI, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '@src/store';

export const authUpdateMiddleware: Middleware = ((store: MiddlewareAPI) =>
  (next: Dispatch<UnknownAction>) =>
  (action: UnknownAction) => {
    const result = next(action);

    const triggers = [
      tasksApi.endpoints.updateStatusTask.matchFulfilled,
      tasksApi.endpoints.createTask.matchFulfilled,
      tasksApi.endpoints.deleteTask.matchFulfilled,
    ];

    if (isAnyOf(...triggers)(action)) {
      (store.dispatch as AppDispatch)(profile());
    }

    return result;
  }) as Middleware;
