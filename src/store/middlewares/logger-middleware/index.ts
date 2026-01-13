import type { Middleware, MiddlewareAPI, Dispatch, UnknownAction } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = ((store: MiddlewareAPI) =>
  (next: Dispatch<UnknownAction>) =>
  (action: UnknownAction) => {
    const shouldLog =
      import.meta.env.DEV &&
      (import.meta.env.VITE_REDUX_LOGGER === 'true' || import.meta.env.VITE_REDUX_LOGGER === undefined);

    if (!shouldLog) return next(action);

    const { getState } = store;

    console.group(`Redux Action: ${action.type}`);
    console.log('Действие:', action);
    console.log('Предыдущее состояние:', getState());

    const result = next(action);

    console.log('Новое состояние:', getState());
    console.groupEnd();

    return result;
  }) as Middleware;
