import type { Middleware, MiddlewareAPI, Dispatch, UnknownAction } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware =
  (store: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
    const { getState } = store;

    console.group(action.type);
    console.log('Действие:', action.type);
    console.log('Предыдущее состояние:', getState());

    const result = next(action);

    console.log('Новое состояние:', getState());
    console.groupEnd();

    return result;
  };
